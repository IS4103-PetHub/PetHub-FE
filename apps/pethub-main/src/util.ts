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

// Convert param to string
export function parseRouterQueryParam(param: string | string[] | undefined) {
  if (!param) {
    return null;
  }
  if (Array.isArray(param)) {
    param = param.join("");
  }
  return param;
}
