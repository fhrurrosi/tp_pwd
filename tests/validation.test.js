import { describe, it, expect } from 'vitest'
import { validateEmail, passwordStrength, validatePhone, normalizePhone } from '../src/lib/validation'

describe('validation utilities', () => {
  it('validateEmail accepts valid emails and rejects invalid', () => {
    expect(validateEmail('user@example.com')).toBe(true)
    expect(validateEmail('user.name+tag@sub.domain.co')).toBe(true)
    expect(validateEmail('invalid-email')).toBe(false)
    expect(validateEmail('a@b')).toBe(false)
  })

  it('passwordStrength scores basic cases', () => {
    expect(passwordStrength('')).toBe(0)
    expect(passwordStrength('abcd')).toBe(0)
    expect(passwordStrength('abcdefgh')).toBe(1) // length
    expect(passwordStrength('Abcdefgh1')).toBe(3) // length + upper + digit
    expect(passwordStrength('Abcdef1!')).toBe(4) // length + upper + digit + symbol
  })

  it('validatePhone accepts +62, 62, and 08 formats', () => {
    expect(validatePhone('+628123456789')).toBe(true)
    expect(validatePhone('628123456789')).toBe(true)
    expect(validatePhone('08123456789')).toBe(true)
    expect(validatePhone('12345')).toBe(false)
  })

  it('normalizePhone converts 08.. and 62.. to +62..', () => {
    expect(normalizePhone('+628123456789')).toBe('+628123456789')
    expect(normalizePhone('628123456789')).toBe('+628123456789')
    expect(normalizePhone('08123456789')).toBe('+628123456789')
    // cleans spaces/dashes
    expect(normalizePhone('08 1234-56789')).toBe('+628123456789')
  })
})
