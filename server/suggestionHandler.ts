import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import {
  validateOtpCode,
  validateSuggestionPayload,
  type CleanSuggestionData,
} from '../src/shared/suggestionValidation.ts';

const DEFAULT_SUGGESTION_RECEIVER_EMAIL = 'pradeep240818@gmail.com';
const DEFAULT_RESEND_FROM = 'Instrument-AI <onboarding@resend.dev>';
const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_MAX_ATTEMPTS_PER_NONCE = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const OTP_REQUEST_MAX_PER_HOUR = 5;
const VERIFY_ATTEMPTS_MAX_PER_HOUR = 15;
const SUBMIT_MAX_PER_HOUR = 3;

export function getSuggestionRecipientEmail(): string {
  return (
    process.env.SUGGESTION_RECEIVER_EMAIL?.trim() ||
    process.env.SUGGESTION_RECIPIENT_EMAIL?.trim() ||
    DEFAULT_SUGGESTION_RECEIVER_EMAIL
  );
}

export interface HttpReqLike {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
}

export interface HttpResLike {
  status: (code: number) => HttpResLike;
  setHeader?: (name: string, value: string) => unknown;
  json: (payload: unknown) => unknown;
}

export interface MailPayload {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
  purpose?: 'otp' | 'suggestion';
}

export type MailSendOutcome =
  | { ok: true }
  | { ok: false; code?: string; message: string };

export interface SuggestionHandlerDeps {
  sendMail?: (mail: MailPayload) => Promise<MailSendOutcome>;
  otpSecret?: string;
  now?: () => number;
}

interface OtpTokenClaims {
  v: 1;
  nonce: string;
  email: string;
  payloadHash: string;
  otpHash: string;
  iat: number;
  exp: number;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getClientIp(req: HttpReqLike): string {
  const fwd = req.headers?.['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.trim()) {
    return fwd.split(',')[0].trim();
  }
  if (Array.isArray(fwd) && fwd[0]) {
    return fwd[0].split(',')[0].trim();
  }
  const realIp = req.headers?.['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) {
    return realIp.trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

function checkRateLimit(
  store: Map<string, number[]>,
  key: string,
  maxPerWindow: number,
  nowMs: number,
  record: boolean,
): boolean {
  const cutoff = nowMs - RATE_LIMIT_WINDOW_MS;
  const existing = (store.get(key) ?? []).filter((ts) => ts > cutoff);
  if (existing.length >= maxPerWindow) {
    store.set(key, existing);
    return false;
  }
  if (record) {
    existing.push(nowMs);
  }
  store.set(key, existing);
  return true;
}

function recordRateHit(store: Map<string, number[]>, key: string, nowMs: number): void {
  const cutoff = nowMs - RATE_LIMIT_WINDOW_MS;
  const existing = (store.get(key) ?? []).filter((ts) => ts > cutoff);
  existing.push(nowMs);
  store.set(key, existing);
}

function formatIstTimestamp(date: Date): string {
  const formatted = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'medium',
    hour12: true,
  }).format(date);
  return `${formatted} IST`;
}

function resolveSigningKey(overrideSecret?: string): Buffer | null {
  const raw =
    overrideSecret?.trim() ||
    process.env.OTP_SECRET?.trim() ||
    process.env.GMAIL_APP_PASSWORD?.trim() ||
    process.env.SMTP_PASS?.trim() ||
    process.env.RESEND_API_KEY?.trim();
  if (!raw) return null;
  return crypto.createHmac('sha256', 'instrument-ai-otp-signing-v1').update(raw).digest();
}

function hashSuggestionData(data: CleanSuggestionData): string {
  return crypto
    .createHash('sha256')
    .update(
      JSON.stringify([
        data.name,
        data.family,
        data.reason,
        data.link,
        data.studentName,
        data.email,
        data.phone,
      ]),
    )
    .digest('hex');
}

function computeOtpDigest(
  key: Buffer,
  nonce: string,
  email: string,
  payloadHash: string,
  otp: string,
): string {
  return crypto
    .createHmac('sha256', key)
    .update(`otp:${nonce}:${email}:${payloadHash}:${otp}`)
    .digest('hex');
}

function safeEqualUtf8(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, 'utf8');
  const bBuf = Buffer.from(b, 'utf8');
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function issueOtpChallenge(
  key: Buffer,
  data: CleanSuggestionData,
  nowMs: number,
): { otp: string; token: string; expMs: number } {
  const otp = String(crypto.randomInt(100000, 1000000));
  const nonce = crypto.randomBytes(16).toString('hex');
  const payloadHash = hashSuggestionData(data);
  const expMs = nowMs + OTP_TTL_MS;
  const claims: OtpTokenClaims = {
    v: 1,
    nonce,
    email: data.email,
    payloadHash,
    otpHash: computeOtpDigest(key, nonce, data.email, payloadHash, otp),
    iat: nowMs,
    exp: expMs,
  };
  const encoded = Buffer.from(JSON.stringify(claims), 'utf8').toString('base64url');
  const sig = crypto.createHmac('sha256', key).update(encoded).digest('base64url');
  return { otp, token: `${encoded}.${sig}`, expMs };
}

function decodeSignedOtpToken(key: Buffer, token: string): OtpTokenClaims | null {
  const dotIdx = token.indexOf('.');
  if (dotIdx <= 0 || dotIdx === token.length - 1) return null;
  const encoded = token.slice(0, dotIdx);
  const sig = token.slice(dotIdx + 1);
  if (!encoded || !sig) return null;

  const expectedSig = crypto.createHmac('sha256', key).update(encoded).digest('base64url');
  if (!safeEqualUtf8(sig, expectedSig)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as Partial<OtpTokenClaims>;
    if (
      parsed.v !== 1 ||
      typeof parsed.nonce !== 'string' ||
      typeof parsed.email !== 'string' ||
      typeof parsed.payloadHash !== 'string' ||
      typeof parsed.otpHash !== 'string' ||
      typeof parsed.exp !== 'number'
    ) {
      return null;
    }
    return parsed as OtpTokenClaims;
  } catch {
    return null;
  }
}

function buildOtpEmailBodies(data: CleanSuggestionData, otp: string) {
  const text = [
    `Your Instrument-AI verification code is: ${otp}`,
    '',
    `Instrument suggestion: ${data.name}`,
    'This code expires in 10 minutes.',
    '',
    'If you did not request this suggestion on Instrument-AI, you can ignore this email.',
  ].join('\n');

  const html = `
    <div style="font-family:Inter,system-ui,-apple-system,sans-serif;max-width:540px;margin:0 auto;color:#141414;line-height:1.5;">
      <h2 style="margin:0 0 10px;color:#121A24;">Verify your NITJ email</h2>
      <p style="margin:0 0 14px;font-size:14px;color:#374151;">
        Use this 6-digit code to finish submitting your suggestion for <strong>${escapeHtml(data.name)}</strong> on Instrument-AI:
      </p>
      <div style="margin:16px 0;padding:14px 18px;border-radius:10px;background:#F1F5F9;border:1px solid #CBD5E1;text-align:center;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:28px;font-weight:700;letter-spacing:8px;color:#121A24;">
        ${escapeHtml(otp)}
      </div>
      <p style="margin:0;font-size:13px;color:#6B7280;">
        This code expires in 10 minutes. If you did not request this, you can safely ignore this email.
      </p>
    </div>
  `.trim();

  return { text, html };
}

function buildSuggestionEmailBodies(data: CleanSuggestionData, submittedAtIst: string) {
  const linkDisplay = data.link || 'None';

  const text = [
    `Instrument name: ${data.name}`,
    `Subject area: ${data.family}`,
    `Why it should be added: ${data.reason}`,
    `Reference link: ${linkDisplay}`,
    `Student name: ${data.studentName}`,
    `Student NITJ email: ${data.email} (OTP verified)`,
    `Phone number: ${data.phone}`,
    `Submitted at: ${submittedAtIst}`,
  ].join('\n');

  const html = `
    <div style="font-family:Inter,system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto;color:#141414;line-height:1.5;">
      <h2 style="margin:0 0 12px;color:#121A24;">New Instrument Suggestion</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;font-weight:600;width:190px;">Instrument name</td><td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;">${escapeHtml(data.name)}</td></tr>
        <tr><td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;font-weight:600;">Subject area</td><td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;">${escapeHtml(data.family)}</td></tr>
        <tr><td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;font-weight:600;vertical-align:top;">Why it should be added</td><td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;white-space:pre-wrap;">${escapeHtml(data.reason)}</td></tr>
        <tr><td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;font-weight:600;">Reference link</td><td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;">${escapeHtml(linkDisplay)}</td></tr>
        <tr><td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;font-weight:600;">Student name</td><td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;">${escapeHtml(data.studentName)}</td></tr>
        <tr><td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;font-weight:600;">Student NITJ email</td><td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;">${escapeHtml(data.email)} <span style="color:#15803d;font-weight:600;">(OTP verified)</span></td></tr>
        <tr><td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;font-weight:600;">Phone number</td><td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;">${escapeHtml(data.phone)}</td></tr>
        <tr><td style="padding:8px 10px;font-weight:600;">Submitted at</td><td style="padding:8px 10px;">${escapeHtml(submittedAtIst)}</td></tr>
      </table>
    </div>
  `.trim();

  return { text, html };
}

async function sendViaResend(apiKey: string, from: string, mail: MailPayload): Promise<MailSendOutcome> {
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [mail.to],
      replyTo: mail.replyTo,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
    if (error) {
      const msg = String(error.message ?? '').toLowerCase();
      if (error.name === 'validation_error' || msg.includes('verify a domain') || msg.includes('testing emails')) {
        return {
          ok: false,
          code: 'RESEND_UNVERIFIED_RECIPIENT',
          message:
            'Cannot send verification code to external NITJ emails on Resend test mode without a verified domain or Gmail/SMTP sender configured.',
        };
      }
      return { ok: false, message: 'Could not send right now. Please try again.' };
    }
    return { ok: true };
  } catch {
    return { ok: false, message: 'Could not send right now. Please try again.' };
  }
}

async function sendViaSmtpOrGmail(mail: MailPayload): Promise<MailSendOutcome | null> {
  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  const smtpFrom = process.env.SMTP_FROM?.trim();

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const port = Number(process.env.SMTP_PORT || 587);
      const secure = port === 465 || process.env.SMTP_SECURE === 'true';
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port,
        secure,
        auth: { user: smtpUser, pass: smtpPass },
      });
      await transporter.sendMail({
        from: smtpFrom || `Instrument-AI <${smtpUser}>`,
        to: mail.to,
        replyTo: mail.replyTo,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
      });
      return { ok: true };
    } catch (err) {
      const e = err as { code?: string; responseCode?: number };
      console.error('[suggestions] SMTP send failed:', e?.code ?? 'UNKNOWN', e?.responseCode ?? '');
      return { ok: false, message: 'Could not send right now. Please try again.' };
    }
  }

  const gmailPass = process.env.GMAIL_APP_PASSWORD?.trim().replace(/\s+/g, '');
  const gmailUser = process.env.GMAIL_USER?.trim();

  if (gmailPass && gmailUser) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: gmailUser, pass: gmailPass },
      });
      await transporter.sendMail({
        from: smtpFrom || `Instrument-AI <${gmailUser}>`,
        to: mail.to,
        replyTo: mail.replyTo,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
      });
      return { ok: true };
    } catch (err) {
      const e = err as { code?: string; responseCode?: number };
      console.error('[suggestions] Gmail SMTP send failed:', e?.code ?? 'UNKNOWN', e?.responseCode ?? '');
      return { ok: false, message: 'Could not send right now. Please try again.' };
    }
  }

  return null;
}

async function defaultSendMail(mail: MailPayload): Promise<MailSendOutcome> {
  const resendKey = process.env.RESEND_API_KEY?.trim();
  const resendFrom = process.env.RESEND_FROM?.trim();

  // Final verified suggestions go via Resend to SUGGESTION_RECEIVER_EMAIL first when RESEND_API_KEY is set,
  // with automatic fallback to Gmail/SMTP if Resend fails or the receiver isn't Resend-verified.
  if (mail.purpose === 'suggestion' && resendKey) {
    const resendOutcome = await sendViaResend(resendKey, resendFrom || DEFAULT_RESEND_FROM, mail);
    if (resendOutcome.ok) return resendOutcome;
    const smtpFallback = await sendViaSmtpOrGmail(mail);
    return smtpFallback ?? resendOutcome;
  }

  // Student OTPs (or any email when custom Resend domain is verified):
  // 1. Resend with verified RESEND_FROM domain
  if (resendKey && resendFrom) {
    return sendViaResend(resendKey, resendFrom, mail);
  }

  // 2. Gmail SMTP (GMAIL_USER + GMAIL_APP_PASSWORD) or custom SMTP for external @nitj.ac.in OTPs
  const smtpOutcome = await sendViaSmtpOrGmail(mail);
  if (smtpOutcome) return smtpOutcome;

  // 3. Last fallback: Resend test sender (only works for Resend account owner address)
  if (resendKey) {
    const fallbackOutcome = await sendViaResend(resendKey, DEFAULT_RESEND_FROM, mail);
    if (!fallbackOutcome.ok && fallbackOutcome.code === 'RESEND_UNVERIFIED_RECIPIENT') {
      console.warn(
        '[suggestions] Resend blocked recipient without a verified domain. Configure GMAIL_USER + GMAIL_APP_PASSWORD or verified RESEND_FROM.',
      );
    }
    return fallbackOutcome;
  }

  return { ok: false, message: 'Could not send right now. Please try again.' };
}

export function createSuggestionHandler(deps: SuggestionHandlerDeps = {}) {
  const sendMail = deps.sendMail ?? defaultSendMail;
  const nowFn = deps.now ?? (() => Date.now());

  const otpRequestTimestamps = new Map<string, number[]>();
  const verifyAttemptTimestamps = new Map<string, number[]>();
  const submissionTimestamps = new Map<string, number[]>();
  const failedOtpAttemptsByNonce = new Map<string, number>();
  const consumedNonces = new Map<string, number>();

  function pruneExpiredState(nowMs: number) {
    for (const [nonce, exp] of consumedNonces.entries()) {
      if (exp <= nowMs) {
        consumedNonces.delete(nonce);
        failedOtpAttemptsByNonce.delete(nonce);
      }
    }
  }

  return async function handleSuggestionRequest(req: HttpReqLike, res: HttpResLike): Promise<void> {
    if (req.method !== 'POST') {
      res.setHeader?.('Allow', 'POST');
      res.status(405).json({ error: 'method', message: 'Method not allowed.' });
      return;
    }

    let parsedBody: unknown = req.body;
    if (typeof req.body === 'string') {
      try {
        parsedBody = JSON.parse(req.body);
      } catch {
        res.status(400).json({ error: 'name', message: 'Invalid JSON request body.' });
        return;
      }
    }

    if (!parsedBody || typeof parsedBody !== 'object') {
      res.status(400).json({ error: 'name', message: 'Invalid request body.' });
      return;
    }

    const bodyObj = parsedBody as Record<string, unknown>;

    // Hidden honeypot check: silently accept and send nothing.
    if (typeof bodyObj.website === 'string' && bodyObj.website.trim().length > 0) {
      res.status(200).json({ ok: true, step: 'submitted' });
      return;
    }

    // Validate form fields cleanly on every action.
    const validation = validateSuggestionPayload(parsedBody);
    if (!validation.valid) {
      res.status(400).json({
        error: validation.field,
        message: validation.message,
        errors: validation.errors,
      });
      return;
    }

    const signingKey = resolveSigningKey(deps.otpSecret);
    if (!signingKey) {
      res.status(502).json({
        error: 'send',
        message: 'Could not send right now. Please try again.',
      });
      return;
    }

    const nowMs = nowFn();
    pruneExpiredState(nowMs);
    const clientIp = getClientIp(req);
    const action = typeof bodyObj.action === 'string' ? bodyObj.action.trim() : '';

    if (action === 'request-otp') {
      if (!checkRateLimit(submissionTimestamps, clientIp, SUBMIT_MAX_PER_HOUR, nowMs, false)) {
        res.status(429).json({
          error: 'rate_limit',
          message: 'Please try again later.',
        });
        return;
      }

      if (!checkRateLimit(otpRequestTimestamps, clientIp, OTP_REQUEST_MAX_PER_HOUR, nowMs, true)) {
        res.status(429).json({
          error: 'rate_limit',
          message: 'Too many verification code requests. Please try again later.',
        });
        return;
      }

      const { otp, token } = issueOtpChallenge(signingKey, validation.data, nowMs);
      const { text, html } = buildOtpEmailBodies(validation.data, otp);
      const result = await sendMail({
        to: validation.data.email,
        subject: `Your Instrument-AI verification code: ${otp}`,
        text,
        html,
        purpose: 'otp',
      });

      if (!result.ok) {
        res.status(502).json({
          error: 'send',
          code: result.code,
          message: result.message,
        });
        return;
      }

      res.status(200).json({
        ok: true,
        step: 'otp-required',
        otpToken: token,
        expiresInSeconds: Math.floor(OTP_TTL_MS / 1000),
        email: validation.data.email,
      });
      return;
    }

    if (action === 'verify-submit') {
      if (!checkRateLimit(verifyAttemptTimestamps, clientIp, VERIFY_ATTEMPTS_MAX_PER_HOUR, nowMs, true)) {
        res.status(429).json({
          error: 'rate_limit',
          message: 'Too many verification attempts. Please try again later.',
        });
        return;
      }

      if (!checkRateLimit(submissionTimestamps, clientIp, SUBMIT_MAX_PER_HOUR, nowMs, false)) {
        res.status(429).json({
          error: 'rate_limit',
          message: 'Please try again later.',
        });
        return;
      }

      const otpRaw = typeof bodyObj.otp === 'string' ? bodyObj.otp.trim() : '';
      const otpFormatError = validateOtpCode(otpRaw);
      if (otpFormatError) {
        res.status(400).json({ error: 'otp', message: otpFormatError });
        return;
      }

      const otpToken = typeof bodyObj.otpToken === 'string' ? bodyObj.otpToken.trim() : '';
      const claims = decodeSignedOtpToken(signingKey, otpToken);
      if (!claims) {
        res.status(400).json({
          error: 'otp',
          message: 'Verification session is invalid or expired. Please request a new code.',
        });
        return;
      }

      if (consumedNonces.has(claims.nonce)) {
        res.status(400).json({
          error: 'otp',
          message: 'This verification code has already been used. Please request a new one.',
        });
        return;
      }

      if (nowMs > claims.exp) {
        res.status(400).json({
          error: 'otp',
          message: 'This verification code has expired. Please request a new one.',
        });
        return;
      }

      const expectedPayloadHash = hashSuggestionData(validation.data);
      if (claims.email !== validation.data.email || claims.payloadHash !== expectedPayloadHash) {
        res.status(400).json({
          error: 'otp',
          message: 'Your form details changed. Please request a new verification code.',
        });
        return;
      }

      const priorFailures = failedOtpAttemptsByNonce.get(claims.nonce) ?? 0;
      if (priorFailures >= OTP_MAX_ATTEMPTS_PER_NONCE) {
        res.status(429).json({
          error: 'otp',
          message: 'Too many incorrect codes entered. Please request a new verification code.',
        });
        return;
      }

      const candidateOtpHash = computeOtpDigest(
        signingKey,
        claims.nonce,
        claims.email,
        claims.payloadHash,
        otpRaw,
      );

      if (!safeEqualUtf8(candidateOtpHash, claims.otpHash)) {
        failedOtpAttemptsByNonce.set(claims.nonce, priorFailures + 1);
        res.status(400).json({
          error: 'otp',
          message: 'Incorrect verification code. Please check your NITJ email and try again.',
        });
        return;
      }

      const submittedAtIst = formatIstTimestamp(new Date(nowMs));
      const { text, html } = buildSuggestionEmailBodies(validation.data, submittedAtIst);
      const safeSubjectName = validation.data.name.replace(/[\r\n]+/g, ' ');

      const mailResult = await sendMail({
        to: getSuggestionRecipientEmail(),
        replyTo: validation.data.email,
        subject: `New instrument suggestion: ${safeSubjectName}`,
        text,
        html,
        purpose: 'suggestion',
      });

      if (!mailResult.ok) {
        res.status(502).json({
          error: 'send',
          code: mailResult.code,
          message: mailResult.message,
        });
        return;
      }

      consumedNonces.set(claims.nonce, claims.exp);
      failedOtpAttemptsByNonce.delete(claims.nonce);
      recordRateHit(submissionTimestamps, clientIp, nowMs);

      res.status(200).json({ ok: true, step: 'submitted' });
      return;
    }

    res.status(400).json({
      error: 'otp',
      message: 'Please verify your NITJ email with a one-time passcode before submitting.',
    });
  };
}

const defaultSuggestionHandler = createSuggestionHandler();

export async function handleSuggestionHttp(req: HttpReqLike, res: HttpResLike): Promise<void> {
  await defaultSuggestionHandler(req, res);
}
