export function validateEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email)
}

export function passwordStrength(p) {
  let score = 0
  if (!p) return 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
}

export function validatePhone(p) {
  if (!p) return false
  const v = p.replace(/\s|-/g, "")
  // Accept +62XXXXXXXX or 62XXXXXXXX or 08XXXXXXXX formats
  if (/^\+62\d{8,13}$/.test(v)) return true
  if (/^62\d{8,13}$/.test(v)) return true
  if (/^08\d{7,12}$/.test(v)) return true
  return false
}

export function normalizePhone(p) {
  if (!p) return p
  let v = p.replace(/\s|-/g, "")
  // If already in +62 format, return as-is
  if (/^\+62\d{8,13}$/.test(v)) return v
  // If starts with 0 (08...), replace leading 0 with +62
  if (/^0\d{7,12}$/.test(v)) return v.replace(/^0/, "+62")
  // If starts with 62 (no plus), add +
  if (/^62\d{8,13}$/.test(v)) return "+" + v
  // Fallback: return cleaned value
  return v
}

export function validateNIM(id) {
  if (!id) return { valid: false, reason: 'empty' }
  const digits = String(id).replace(/\D/g, '')
  if (digits.length < 10) return { valid: false, reason: 'length' }

  const yearTwo = digits.slice(0, 2)
  const year = 2000 + parseInt(yearTwo, 10)
  const currentYear = new Date().getFullYear()
  if (isNaN(year) || year < 2000 || year > currentYear) return { valid: false, reason: 'year', year }

  const prodi = digits.slice(2, 7)
  if (!/^\d{5}$/.test(prodi) || prodi === '00000') return { valid: false, reason: 'prodi', prodi }

  return { valid: true, year, prodi }
}
