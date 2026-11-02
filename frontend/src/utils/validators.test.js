import { describe, it, expect } from 'vitest';
import { normaliseMobile, validatePatient } from './validators.js';

const now = new Date(2026, 10, 2, 12);
const ok = { fullName: 'Lakshmi Narayanan', dob: '1985-03-12', location: 'Thillai Nagar, Trichy', mobile: '9876543210', email: '', consent: true };

describe('validatePatient', () => {
  it('accepts a valid patient (email optional)', () => {
    expect(validatePatient(ok, now)).toEqual({});
  });
  it('accepts Tamil and Telugu names', () => {
    expect(validatePatient({ ...ok, fullName: 'லட்சுமி நாராயணன்' }, now)).toEqual({});
    expect(validatePatient({ ...ok, fullName: 'లక్ష్మి నారాయణ' }, now)).toEqual({});
  });
  it('rejects empty/invalid/long names', () => {
    expect(validatePatient({ ...ok, fullName: '  ' }, now).fullName).toBe('nameRequired');
    expect(validatePatient({ ...ok, fullName: 'A1<script>' }, now).fullName).toBe('nameInvalid');
    expect(validatePatient({ ...ok, fullName: 'a'.repeat(81) }, now).fullName).toBe('nameTooLong');
  });
  it('rejects future DOB', () => {
    expect(validatePatient({ ...ok, dob: '2027-01-01' }, now).dob).toBe('dobFuture');
  });
  it('validates mobile', () => {
    expect(validatePatient({ ...ok, mobile: '12345' }, now).mobile).toBe('mobileInvalid');
    expect(validatePatient({ ...ok, mobile: '5876543210' }, now).mobile).toBe('mobileInvalid');
    expect(validatePatient({ ...ok, mobile: '+91 98765 43210' }, now)).toEqual({});
    expect(normaliseMobile('09876543210')).toBe('9876543210');
  });
  it('validates optional email only when present', () => {
    expect(validatePatient({ ...ok, email: 'bad' }, now).email).toBe('emailInvalid');
    expect(validatePatient({ ...ok, email: 'a@b.co' }, now)).toEqual({});
  });
  it('requires consent', () => {
    expect(validatePatient({ ...ok, consent: false }, now).consent).toBe('consentRequired');
  });
});
