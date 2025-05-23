export interface User {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  username: string;
  profilePicture?: string | null;
  password?: string;
  passwordConfirm?: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  manualSignup: boolean;
  googleAccount: boolean;
  githubAccount: boolean;
  github_url?: string;
  linkedinAccount: boolean;
  education?: string;
  interests: string[];
  additionalInfo: {
    userType?: string;
    gender?: string;
    institute?: string;
    currentCity?: string;
  };
  bio: string;
  blockedUsers: string[];
  settings: {
    notifications: boolean;
    theme: 'light' | 'dark';
  };
  accountStatus: 'active' | 'suspended' | 'deactivated';
  createdAt: Date;
  onlineStatus: boolean;
  lastSeen?: Date;
  contacts: string[];
  chats: {
    chatIds: string[];
    groupChatIds: string[];
  };

  postsCount: number;
  followingCommunitiesCount: number;
  followingsCount: number;
  followersCount: number;
  savesCount: number;

  isAdditionalInfoFilled(): {
    message: IResponseMessage;
    redirectUrl: string;
    errorCode: ErrorCodeType;
  } | null;
  correctPassword(candidatePassword: string, userPasswordInDB: string): Promise<boolean>;
  changedPasswordAfter(JwtTimestamp: number): boolean;
  createPasswordResetToken(): string;
}

interface UserInfoResponse {
  status: string;
  message: string;
  data: {
    user: User;
  };
  redirectUrl?: string;
}
