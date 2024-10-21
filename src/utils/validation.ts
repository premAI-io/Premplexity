// (?=.*[a-z]) - at least one lowercase letter
// (?=.*[A-Z]) - at least one uppercase letter
// (?=.*\d) - at least one digit
// (?=.*[@$!%*?&]) - at least one special character
// [A-Za-z\d@$!%*?&]{8,} - at least 8 characters
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>\-_])[-A-Za-z\d!@#$%^&*(),.?":{}|<>_]{8,}$/

export const validatePassword = (password: string): boolean => {
  return password.match(PASSWORD_REGEX) !== null
}

const EMAIL_REGEX = /.+@.+\..+/
export const validateEmail = (email: string): boolean => {
  return email.match(EMAIL_REGEX) !== null
}
