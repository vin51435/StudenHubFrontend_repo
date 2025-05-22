export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface UserInfoResponse {
  status: string;
  message: string;
  data: {
    user: User;
  };
  redirectUrl?: string;
}
