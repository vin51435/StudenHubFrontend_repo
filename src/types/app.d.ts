import { VoteEnum } from '@src/types/enum';

export type SelectState = {
  load: boolean;
  options: Record<string, DefaultOptionType[]>;
  values: Record<string, DefaultOptionType | DefaultOptionType[]> | null;
};

export interface RouteNode {
  name: string;
  path: string;
  title?: string;
  children?: RouteNode[];
}

export type RouteConfig = RouteNode[];

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  username: string;
  profilePicture: string;
  password: string;
  passwordConfirm: string;
  passwordChangedAt: string;
  passwordResetToken: string;
  passwordResetExpires: string;
  manualSignup: boolean;
  googleAccount: boolean;
  githubAccount: boolean;
  github_url: string;
  linkedinAccount: boolean;
  education: string;
  interests: string[];
  additionalInfo: {
    userType: string;
    gender: string;
    institute: string;
    currentCity: string;
  };
  bio: string;
  blockedUsers: string[];
  settings: {
    notifications: boolean;
    theme: string;
  };
  accountStatus: string;
  role: string;
  createdAt: string;
  onlineStatus: boolean;
  lastSeen: string;
  contacts: string[];
  chats: {
    chatIds: string[];
    groupChatIds?: string[];
  };

  postsCount: number;
  followingCommunitiesCount: number;
  followingsCount: number;
  followersCount: number;
  savesCount: number;
  isFollowing: boolean;
}

export interface ICommunity {
  _id: string;
  name: string;
  slug: string;
  description: string;
  children: any[];
  path: any[];
  avatarUrl: string;
  bannerUrl?: string;
  type: string;
  owner: string;
  members: any[];
  membersCount: number;
  followersCount: number;
  isFollowing?: boolean;
  moderators: any[];
  bannedUsers: any[];
  blockedUsers: any[];
  mutedUsers: any[];
  invitedUsers: any[];
  createdAt: string;
  updatedAt: string;
}

export interface IPost {
  _id: string;
  title: string;
  slug: string;
  content?: string;
  mediaUrls: string[];
  tags: string[];

  communityId: string | ICommunity;
  authorId: string | IUser;

  views: number;
  upvotesCount: number;
  downvotesCount: number;
  commentsCount: number;
  savesCount: number;
  isSaved: boolean;
  voteType?: VoteEnum | null;
  netVotes?: number;

  popularityScore: number;
  popularityUpdatedAt?: string;
  isDeleted?: boolean;
  isFlagged?: boolean;
  isApproved?: boolean;
  flagReason?: string;

  createdAt: string;
  updatedAt?: string;
}

export interface LogEntry {
  _id: string;
  ip: string;
  user: ObjectId;
  username: string;
  userAgent: string;
  path: string;
  device: {
    os: string;
    browser: string;
    platform: string;
  };
  location: {
    country: string;
    region: string;
    city: string;
    lat: number;
    lon: number;
  };
  timeWindow?: Date;
  createdAt: Date;
  updatedAt: Date;
}
