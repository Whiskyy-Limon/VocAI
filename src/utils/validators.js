export function emailValid(email) {
  return /^[a-zA-Z0-9._%-]{5,}@[a-zA-Z0-9.-]{3,}\.[a-zA-Z]{2,}$/.test(email)
}

/** Reglas individuales de la contraseña */
export const PASSWORD_RULES = [
  { key: 'length',   label: 'Mínimo 8 caracteres',       test: pw => pw.length >= 8 },
  { key: 'upper',    label: 'Una letra mayúscula (A-Z)',  test: pw => /[A-Z]/.test(pw) },
  { key: 'lower',    label: 'Una letra minúscula (a-z)',  test: pw => /[a-z]/.test(pw) },
  { key: 'number',   label: 'Un número (0-9)',            test: pw => /[0-9]/.test(pw) },
  { key: 'special',  label: 'Un carácter especial (!@#…)',test: pw => /[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>\/?`~]/.test(pw) },
]

/**
 * Devuelve el array de reglas con `ok: true/false` para cada una.
 * Útil para mostrar el checklist visual.
 */
export function checkPasswordRules(pw) {
  if (typeof pw !== 'string') return PASSWORD_RULES.map(r => ({ ...r, ok: false }))
  return PASSWORD_RULES.map(r => ({ ...r, ok: r.test(pw) }))
}

/** true solo si todas las reglas pasan */
export function passwordValid(pw) {
  if (typeof pw !== 'string') return false
  return PASSWORD_RULES.every(r => r.test(pw))
}
