import { IUser } from '@src/types/app';

interface AuthState {
  isAuthenticated: boolean;
  redirectUrl: string | null;
  user: IUser | null;
  token: string | null;
}

interface LoginPayload {
  user: IUser;
  token?: string;
  redirectUrl?: string | null | undefined;
}
