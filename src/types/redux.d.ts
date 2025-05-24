import { User } from './users';

interface AuthState {
  isAuthenticated: boolean;
  redirectUrl: string | null;
  user: User;
  token: string | null;
}

interface LoginPayload {
  user: User;
  token?: string;
  redirectUrl?: string | null | undefined;
}
