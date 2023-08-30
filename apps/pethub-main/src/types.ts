export interface LoginCredentials {
  username: string;
  password: string;
  accountType: string;
}

export interface LoginResponse {
  // ...whatever shape the response has ltr
  token?: string;
  error?: string;
  role: string;
}

// Another for API response when available
