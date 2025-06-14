interface UserInfoResponse {
  status: string;
  message: string;
  data: {
    user: User;
  };
  redirectUrl?: string | null;
}
