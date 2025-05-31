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
  __v: number;
}
