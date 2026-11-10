export const SUBJECT_AREAS = [
  'Temperature',
  'Pressure',
  'Flow',
  'Level',
  'Electrical',
  'Bridges',
  'Analytical & Optical',
  'Control & Actuators',
  'Sensors & Motion',
  'Other',
] as const;

export type SuggestionField =
  | 'name'
  | 'family'
  | 'reason'
  | 'link'
  | 'studentName'
  | 'email'
  | 'phone';

export interface SuggestionInputPayload {
  name: string;
  family: string;
  reason: string;
  link: string;
  studentName: string;
  email: string;
  phone: string;
  website: string;
}

export interface SuggestionRequestOtpPayload extends SuggestionInputPayload {
  action: 'request-otp';
}

export interface SuggestionVerifySubmitPayload extends SuggestionInputPayload {
  action: 'verify-submit';
  otp: string;
  otpToken: string;
}

export type SuggestionActionResponse =
  | {
      ok: true;
      step: 'otp-required';
      otpToken: string;
      expiresInSeconds: number;
      email: string;
    }
  | {
      ok: true;
      step: 'submitted';
    };

export interface CleanSuggestionData {
  name: string;
  family: string;
  reason: string;
  link: string;
  studentName: string;
  email: string;
  phone: string;
}

export const NITJ_EMAIL_REGEX =
  /^(?:[a-z0-9]+(?:[._-][a-z0-9]+)*\.)?[a-z]{2,4}\.\d{2}@nitj\.ac\.in$/i;
export const MOBILE_10_DIGIT_REGEX = /^[6-9]\d{9}$/;
export const OTP_CODE_REGEX = /^\d{6}$/;

export function normalizeOtpCode(raw: string): string {
  return raw.replace(/\D+/g, '').slice(0, 6);
}

export function validateOtpCode(raw: string): string | undefined {
  const digits = raw.trim();
  if (!OTP_CODE_REGEX.test(digits)) {
    return 'Please enter the 6-digit verification code sent to your NITJ email.';
  }
  return undefined;
}

/**
 * Normalizes an Indian mobile number by stripping spaces, hyphens, and optional +91/91 prefix.
 * Returns the cleaned 10-digit number starting with 6–9, or null if invalid.
 */
export function normalizeIndianMobile(raw: string): string | null {
  const stripped = raw.trim().replace(/[\s-]+/g, '');
  let digits = stripped;
  if (digits.startsWith('+91')) {
    digits = digits.slice(3);
  } else if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  }
  return MOBILE_10_DIGIT_REGEX.test(digits) ? digits : null;
}

export function validateSuggestionField(field: SuggestionField, rawValue: string): string | undefined {
  const value = rawValue.trim();

  switch (field) {
    case 'name':
      if (!value) return 'Please enter the instrument name.';
      if (value.length > 120) return 'Please keep the instrument name under 120 characters.';
      return undefined;

    case 'family':
      if (!value || !(SUBJECT_AREAS as readonly string[]).includes(value)) {
        return 'Please choose a subject area.';
      }
      return undefined;

    case 'reason':
      if (!value) return 'Please explain why this instrument should be added.';
      if (value.length > 500) return 'Please keep the explanation under 500 characters.';
      return undefined;

    case 'link':
      if (value && !/^https?:\/\/\S+$/i.test(value)) {
        return 'Reference link must start with http:// or https://.';
      }
      return undefined;

    case 'studentName':
      if (!value) return 'Please enter your name.';
      if (value.length > 80) return 'Please keep your name under 80 characters.';
      return undefined;

    case 'email':
      if (!value || !NITJ_EMAIL_REGEX.test(value)) {
        return 'Please use your NITJ college email, like pradeepka.ic.24@nitj.ac.in.';
      }
      return undefined;

    case 'phone':
      if (!normalizeIndianMobile(value)) {
        return 'Please enter a valid 10-digit mobile number.';
      }
      return undefined;
  }
}

export function validateSuggestionPayload(raw: unknown):
  | { valid: true; data: CleanSuggestionData }
  | { valid: false; field: SuggestionField; message: string; errors: Partial<Record<SuggestionField, string>> } {
  const body = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;

  const nameRaw = typeof body.name === 'string' ? body.name : '';
  const familyRaw = typeof body.family === 'string' ? body.family : '';
  const reasonRaw = typeof body.reason === 'string' ? body.reason : '';
  const linkRaw = typeof body.link === 'string' ? body.link : '';
  const studentNameRaw =
    typeof body.studentName === 'string'
      ? body.studentName
      : typeof body.contactName === 'string'
      ? body.contactName
      : '';
  const emailRaw =
    typeof body.email === 'string'
      ? body.email
      : typeof body.contactEmail === 'string'
      ? body.contactEmail
      : '';
  const phoneRaw = typeof body.phone === 'string' ? body.phone : '';

  const fields: [SuggestionField, string][] = [
    ['name', nameRaw],
    ['family', familyRaw],
    ['reason', reasonRaw],
    ['link', linkRaw],
    ['studentName', studentNameRaw],
    ['email', emailRaw],
    ['phone', phoneRaw],
  ];

  const errors: Partial<Record<SuggestionField, string>> = {};
  let firstField: SuggestionField | null = null;
  let firstMessage = '';

  for (const [field, val] of fields) {
    const err = validateSuggestionField(field, val);
    if (err) {
      errors[field] = err;
      if (!firstField) {
        firstField = field;
        firstMessage = err;
      }
    }
  }

  if (firstField) {
    return { valid: false, field: firstField, message: firstMessage, errors };
  }

  const normalizedPhone = normalizeIndianMobile(phoneRaw) ?? '';

  return {
    valid: true,
    data: {
      name: nameRaw.trim(),
      family: familyRaw.trim(),
      reason: reasonRaw.trim(),
      link: linkRaw.trim(),
      studentName: studentNameRaw.trim(),
      email: emailRaw.trim().toLowerCase(),
      phone: normalizedPhone,
    },
  };
}

