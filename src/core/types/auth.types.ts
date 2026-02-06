export interface AuthUser {
  id: number;
  username: string;
  email: string;
  is_guest: boolean;
}

export interface AuthStatusResponse {
  is_authenticated: boolean;
  user: AuthUser;
}
