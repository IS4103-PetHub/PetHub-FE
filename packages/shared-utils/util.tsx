export function validatePassword(password: string) {
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  if (!hasLetter || !hasDigit) {
    return "Password must contain at least 1 letter and 1 digit.";
  }

  if (/\s/.test(password)) {
    return "Password must not contain spaces.";
  }

  return null;
}

export function validateChangePassword(password: string, newPassword: string) {
  if (!password) {
    return "Please enter your new password.";
  }
  if (password === newPassword) {
    return "New password cannot be the same as current password.";
  }
  return validatePassword(newPassword);
}
