export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  // ...whatever shape the response has ltr
  token?: string;
  error?: string;
  role: string;
}

// Another for API response when available
