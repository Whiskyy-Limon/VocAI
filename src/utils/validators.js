export function emailValid(email) {
  // Mínimo 5 caracteres antes del @, dominio válido con extensión
  return /^[a-zA-Z0-9._%-]{5,}@[a-zA-Z0-9.-]{3,}\.[a-zA-Z]{2,}$/.test(email)
}
export function passwordValid(pw) {
  // Mínimo 8 caracteres, 1 mayúscula, 1 número, 1 símbolo
  if (typeof pw !== 'string' || pw.length < 8) return false
  return /[A-Z]/.test(pw) && /[0-9]/.test(pw) && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw)
}
