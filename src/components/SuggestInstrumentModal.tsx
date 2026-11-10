import { ArrowLeft, MailCheck, Plus, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { api, ApiSubmissionError } from '@/lib/api';
import {
  normalizeOtpCode,
  SUBJECT_AREAS,
  type SuggestionField,
  validateOtpCode,
  validateSuggestionField,
  validateSuggestionPayload,
} from '@/shared/suggestionValidation';

type FormErrors = Partial<Record<SuggestionField, string>>;
type ModalStep = 'form' | 'otp';

interface SuggestInstrumentModalProps {
  open: boolean;
  onClose: () => void;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}

const KNOWN_FIELDS = new Set<SuggestionField>([
  'name',
  'family',
  'reason',
  'link',
  'studentName',
  'email',
  'phone',
]);

export function SuggestInstrumentModal({
  open,
  onClose,
  returnFocusRef,
}: SuggestInstrumentModalProps) {
  const titleId = useId();
  const descId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const otpInputRef = useRef<HTMLInputElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const [name, setName] = useState('');
  const [family, setFamily] = useState<string>(SUBJECT_AREAS[0]);
  const [reason, setReason] = useState('');
  const [link, setLink] = useState('');
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');

  const [modalStep, setModalStep] = useState<ModalStep>('form');
  const [otpToken, setOtpToken] = useState('');
  const [verifiedEmailTarget, setVerifiedEmailTarget] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedOk, setSubmittedOk] = useState(false);

  const clearTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const resetForm = () => {
    setName('');
    setFamily(SUBJECT_AREAS[0]);
    setReason('');
    setLink('');
    setStudentName('');
    setEmail('');
    setPhone('');
    setWebsite('');
    setModalStep('form');
    setOtpToken('');
    setVerifiedEmailTarget('');
    setOtp('');
    setOtpError('');
    setResending(false);
    setResendCooldown(0);
    setErrors({});
    setGeneralError('');
    setSubmitting(false);
    setSubmittedOk(false);
  };

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      const focusTimer = window.setTimeout(() => {
        nameInputRef.current?.focus();
      }, 20);
      return () => window.clearTimeout(focusTimer);
    }

    clearTimer();
    resetForm();
    const fallbackTarget = returnFocusRef?.current ?? previousFocusRef.current;
    if (fallbackTarget && document.contains(fallbackTarget)) {
      window.setTimeout(() => fallbackTarget.focus(), 0);
    }
    return undefined;
  }, [open, returnFocusRef]);

  useEffect(() => {
    if (!open || modalStep !== 'otp') return undefined;
    const timer = window.setTimeout(() => {
      otpInputRef.current?.focus();
    }, 20);
    return () => window.clearTimeout(timer);
  }, [open, modalStep]);

  useEffect(() => {
    if (resendCooldown <= 0) return undefined;
    const timer = window.setTimeout(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [resendCooldown]);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== 'Tab' || !dialogRef.current) return;

      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter(
        (el) =>
          el.getAttribute('aria-hidden') !== 'true' &&
          (el.offsetParent !== null || el === document.activeElement),
      );

      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first || !dialogRef.current.contains(document.activeElement)) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last || !dialogRef.current.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  useEffect(() => () => clearTimer(), []);

  if (!open) return null;

  const currentPayload = {
    name,
    family,
    reason,
    link,
    studentName,
    email,
    phone,
    website,
  };

  const validateSingleOnBlur = (field: SuggestionField, value: string) => {
    const err = validateSuggestionField(field, value);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const clearFieldErrorIfEdited = (field: SuggestionField) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (generalError) {
      setGeneralError('');
    }
    // Editing the form invalidates any previously issued OTP token so a fresh code is sent.
    if (otpToken) {
      setOtpToken('');
    }
  };

  const scheduleAutoClose = () => {
    clearTimer();
    closeTimerRef.current = window.setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleRequestOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || submittedOk) return;

    const validation = validateSuggestionPayload(currentPayload);
    if (!validation.valid) {
      setErrors(validation.errors);
      setGeneralError('');
      return;
    }

    setSubmitting(true);
    setErrors({});
    setGeneralError('');
    setOtpError('');

    try {
      const res = await api.requestSuggestionOtp(currentPayload);
      if (res.step === 'submitted') {
        setSubmittedOk(true);
        scheduleAutoClose();
        return;
      }

      setOtpToken(res.otpToken);
      setVerifiedEmailTarget(res.email);
      setOtp('');
      setOtpError('');
      setResendCooldown(30);
      setModalStep('otp');
    } catch (err) {
      if (err instanceof ApiSubmissionError) {
        if (err.field && KNOWN_FIELDS.has(err.field as SuggestionField)) {
          setErrors((prev) => ({ ...prev, [err.field as SuggestionField]: err.message }));
        } else {
          setGeneralError(err.message);
        }
      } else {
        setGeneralError('Could not send right now. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || resending || submittedOk) return;

    const cleanOtp = otp.trim();
    const formatErr = validateOtpCode(cleanOtp);
    if (formatErr) {
      setOtpError(formatErr);
      setGeneralError('');
      otpInputRef.current?.focus();
      return;
    }

    setSubmitting(true);
    setOtpError('');
    setGeneralError('');

    try {
      await api.verifySuggestionAndSubmit({
        ...currentPayload,
        otp: cleanOtp,
        otpToken,
      });
      setSubmittedOk(true);
      scheduleAutoClose();
    } catch (err) {
      if (err instanceof ApiSubmissionError) {
        if (err.field === 'otp') {
          setOtpError(err.message);
          otpInputRef.current?.focus();
        } else if (err.field && KNOWN_FIELDS.has(err.field as SuggestionField)) {
          setModalStep('form');
          setErrors((prev) => ({ ...prev, [err.field as SuggestionField]: err.message }));
        } else {
          setGeneralError(err.message);
        }
      } else {
        setGeneralError('Could not send right now. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (resending || submitting || submittedOk || resendCooldown > 0) return;

    setResending(true);
    setOtpError('');
    setGeneralError('');

    try {
      const res = await api.requestSuggestionOtp(currentPayload);
      if (res.step === 'submitted') {
        setSubmittedOk(true);
        scheduleAutoClose();
        return;
      }
      setOtpToken(res.otpToken);
      setVerifiedEmailTarget(res.email);
      setOtp('');
      setResendCooldown(30);
      otpInputRef.current?.focus();
    } catch (err) {
      if (err instanceof ApiSubmissionError) {
        setGeneralError(err.message);
      } else {
        setGeneralError('Could not resend verification code right now. Please try again.');
      }
    } finally {
      setResending(false);
    }
  };

  const handleBackToForm = () => {
    if (submitting || resending || submittedOk) return;
    setModalStep('form');
    setOtp('');
    setOtpError('');
    setGeneralError('');
    window.setTimeout(() => {
      nameInputRef.current?.focus();
    }, 20);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className={`glass flex max-h-[88vh] w-full flex-col overflow-hidden shadow-2xl transition-[max-width] duration-150 ${
          modalStep === 'otp' ? 'max-w-md' : 'max-w-xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--st-line)] px-6 py-4">
          <div className="space-y-1">
            {modalStep === 'otp' ? (
              <>
                <h2
                  id={titleId}
                  className="flex items-center gap-2 text-[20px] font-semibold text-[var(--st-on)]"
                >
                  <MailCheck className="size-5 shrink-0 text-[var(--st-accent)]" />
                  Verify your NITJ email
                </h2>
                <p id={descId} className="text-[14px] text-[var(--st-on-var)]">
                  Enter the 6-digit OTP sent to{' '}
                  <span className="font-mono font-medium text-[var(--st-on)]">
                    {verifiedEmailTarget || email.trim()}
                  </span>
                </p>
              </>
            ) : (
              <>
                <h2
                  id={titleId}
                  className="flex items-center gap-2 text-[20px] font-semibold text-[var(--st-on)]"
                >
                  <Plus className="size-5 shrink-0 text-[var(--st-accent)]" />
                  Suggest an instrument
                </h2>
                <p id={descId} className="text-[14px] text-[var(--st-on-var)]">
                  Tell us which instrument should be added. We review every suggestion.
                </p>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="icon-btn"
            aria-label="Close suggestion form"
          >
            <X className="size-4" />
          </button>
        </div>

        {modalStep === 'otp' ? (
          <form onSubmit={handleVerifyOtpSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              <div className="rounded-xl border border-[var(--st-line)] bg-[var(--st-1)]/60 px-3.5 py-2.5 text-[13px] text-[var(--st-on-var)]">
                Instrument:{' '}
                <span className="font-medium text-[var(--st-on)]">{name.trim()}</span>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="suggest-otp-code" className="label">
                  One-time passcode (OTP) <span className="text-[var(--st-crimson)]">*</span>
                </label>
                <input
                  ref={otpInputRef}
                  id="suggest-otp-code"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => {
                    setOtp(normalizeOtpCode(e.target.value));
                    if (otpError) setOtpError('');
                    if (generalError) setGeneralError('');
                  }}
                  placeholder="000000"
                  className="field-rect text-center font-mono text-[22px] font-semibold tracking-[0.4em] indent-[0.4em]"
                  aria-invalid={Boolean(otpError)}
                />
                {otpError && (
                  <p role="alert" className="text-[14px] text-[var(--st-crimson)]">
                    {otpError}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] text-[var(--st-on-var)]">
                <span>Code expires in 10 minutes</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending || submitting || submittedOk || resendCooldown > 0}
                  className="font-medium text-[var(--st-accent-text)] transition-opacity hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {resending
                    ? 'Sending code...'
                    : resendCooldown > 0
                    ? `Resend OTP (${resendCooldown}s)`
                    : 'Resend OTP'}
                </button>
              </div>
            </div>

            <div className="shrink-0 space-y-3 border-t border-[var(--st-line)] px-6 py-4">
              {submittedOk && (
                <div
                  role="status"
                  className="rounded-xl border border-[var(--st-accent)]/40 bg-[color-mix(in_srgb,var(--st-accent)_12%,transparent)] px-4 py-3 text-[14px] font-semibold text-[var(--st-accent-text)]"
                >
                  Thank you. Your suggestion has been sent.
                </div>
              )}

              {generalError && !submittedOk && (
                <div
                  role="alert"
                  className="rounded-xl border border-[var(--st-crimson)]/40 bg-[color-mix(in_srgb,var(--st-crimson)_12%,transparent)] px-4 py-3 text-[14px] text-[var(--st-crimson)]"
                >
                  {generalError}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleBackToForm}
                  disabled={submitting || resending || submittedOk}
                  className="btn inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="size-4" />
                  Back
                </button>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={onClose} className="btn">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || resending || submittedOk}
                    className="btn primary"
                  >
                    {submitting ? 'Verifying...' : 'Verify & submit'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRequestOtpSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
              {/* Hidden anti-spam honeypot field — never visible or focusable to real users */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '-9999px',
                  width: '1px',
                  height: '1px',
                  overflow: 'hidden',
                  opacity: 0,
                  pointerEvents: 'none',
                }}
              >
                <label htmlFor="suggest-honeypot-website">Website</label>
                <input
                  id="suggest-honeypot-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="suggest-inst-name" className="label">
                  Instrument name <span className="text-[var(--st-crimson)]">*</span>
                </label>
                <input
                  ref={nameInputRef}
                  id="suggest-inst-name"
                  name="name"
                  type="text"
                  maxLength={120}
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearFieldErrorIfEdited('name');
                  }}
                  onBlur={() => validateSingleOnBlur('name', name)}
                  placeholder="For example: Coriolis Mass Flow Meter"
                  className="field-rect"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && (
                  <p role="alert" className="text-[14px] text-[var(--st-crimson)]">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="suggest-inst-area" className="label">
                  Subject area
                </label>
                <select
                  id="suggest-inst-area"
                  name="family"
                  value={family}
                  onChange={(e) => {
                    setFamily(e.target.value);
                    clearFieldErrorIfEdited('family');
                  }}
                  onBlur={() => validateSingleOnBlur('family', family)}
                  className="field-rect cursor-pointer"
                  aria-invalid={Boolean(errors.family)}
                >
                  {SUBJECT_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
                {errors.family && (
                  <p role="alert" className="text-[14px] text-[var(--st-crimson)]">
                    {errors.family}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="suggest-inst-reason" className="label">
                  Why it should be added <span className="text-[var(--st-crimson)]">*</span>
                </label>
                <textarea
                  id="suggest-inst-reason"
                  name="reason"
                  rows={2}
                  maxLength={500}
                  required
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    clearFieldErrorIfEdited('reason');
                  }}
                  onBlur={() => validateSingleOnBlur('reason', reason)}
                  placeholder="For example: used in refinery crude heaters"
                  className="field-rect resize-y"
                  aria-invalid={Boolean(errors.reason)}
                />
                <div className="flex items-center justify-between gap-2 text-[14px]">
                  {errors.reason ? (
                    <p role="alert" className="text-[var(--st-crimson)]">
                      {errors.reason}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span className="text-[var(--st-on-var)]">{reason.length}/500</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="suggest-inst-link" className="label">
                  Reference link (optional)
                </label>
                <input
                  id="suggest-inst-link"
                  name="link"
                  type="url"
                  value={link}
                  onChange={(e) => {
                    setLink(e.target.value);
                    clearFieldErrorIfEdited('link');
                  }}
                  onBlur={() => validateSingleOnBlur('link', link)}
                  placeholder="https://..."
                  className="field-rect"
                  aria-invalid={Boolean(errors.link)}
                />
                {errors.link && (
                  <p role="alert" className="text-[14px] text-[var(--st-crimson)]">
                    {errors.link}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="suggest-student-name" className="label">
                  Student name <span className="text-[var(--st-crimson)]">*</span>
                </label>
                <input
                  id="suggest-student-name"
                  name="studentName"
                  type="text"
                  maxLength={80}
                  required
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    clearFieldErrorIfEdited('studentName');
                  }}
                  onBlur={() => validateSingleOnBlur('studentName', studentName)}
                  placeholder="Your full name"
                  className="field-rect"
                  aria-invalid={Boolean(errors.studentName)}
                />
                {errors.studentName && (
                  <p role="alert" className="text-[14px] text-[var(--st-crimson)]">
                    {errors.studentName}
                  </p>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="suggest-student-email" className="label">
                    Student email <span className="text-[var(--st-crimson)]">*</span>
                  </label>
                  <input
                    id="suggest-student-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearFieldErrorIfEdited('email');
                    }}
                    onBlur={() => validateSingleOnBlur('email', email)}
                    placeholder="pradeepka.ic.24@nitj.ac.in"
                    className="field-rect"
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && (
                    <p role="alert" className="text-[14px] text-[var(--st-crimson)]">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="suggest-student-phone" className="label">
                    Phone number <span className="text-[var(--st-crimson)]">*</span>
                  </label>
                  <input
                    id="suggest-student-phone"
                    name="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      clearFieldErrorIfEdited('phone');
                    }}
                    onBlur={() => validateSingleOnBlur('phone', phone)}
                    placeholder="9876543210"
                    className="field-rect"
                    aria-invalid={Boolean(errors.phone)}
                  />
                  {errors.phone && (
                    <p role="alert" className="text-[14px] text-[var(--st-crimson)]">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="shrink-0 space-y-3 border-t border-[var(--st-line)] px-6 py-4">
              {submittedOk && (
                <div
                  role="status"
                  className="rounded-xl border border-[var(--st-accent)]/40 bg-[color-mix(in_srgb,var(--st-accent)_12%,transparent)] px-4 py-3 text-[14px] font-semibold text-[var(--st-accent-text)]"
                >
                  Thank you. Your suggestion has been sent.
                </div>
              )}

              {generalError && !submittedOk && (
                <div
                  role="alert"
                  className="rounded-xl border border-[var(--st-crimson)]/40 bg-[color-mix(in_srgb,var(--st-crimson)_12%,transparent)] px-4 py-3 text-[14px] text-[var(--st-crimson)]"
                >
                  {generalError}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-end gap-3">
                <button type="button" onClick={onClose} className="btn">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || submittedOk}
                  className="btn primary"
                >
                  {submitting ? 'Sending code...' : 'Send suggestion'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
