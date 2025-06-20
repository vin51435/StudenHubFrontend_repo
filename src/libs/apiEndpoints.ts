import { VoteEnum } from '@src/types/enum';

const isLocalhost = window.location.hostname === 'localhost';

export const activeHost =
  import.meta.env.VITE_NODE_ENV === 'development'
    ? isLocalhost
      ? import.meta.env.VITE_DEV_BACKEND_DEV
      : import.meta.env.VITE_DEV_BACKEND_DEV_HOSTED
    : import.meta.env.VITE_DEV_BACKEND_PROD;

export const BASE_URLS = {
  googleAuth: `${activeHost}/oauth2/google`,
  githubAuth: `${activeHost}/oauth2/github`,
  auth: `${activeHost}/api/v1/auth`,
  user: `${activeHost}/api/v1/user`,
  userFormats: `${activeHost}/api/v1/userformat`,
  center: `${activeHost}/api/v1/center`,
  comments: `${activeHost}/api/v1/comments`,
  admin: `${activeHost}/api/v1/admin`,
};

export const AUTH_ENDPOINTS = {
  USER: '/',
  USER_PICTURE: '/picture',
  USER_EMAIL_REG: '/emailReg',
  USER_EMAIL_VERIFY: '/emailVerify',
  USER_SIGNUP: '/signup',
  USER_SIGNUP_DETAILS: '/signupdetails',
  USER_SIGNUP_INTEREST: '/signupinterest',
  USER_FORGOT_PASSWORD: (token?: string) => `/forgotPassword${token ? `/${token}` : ''}`,
  USER_LOGIN: '/login',
  USER_LOGOUT: '/logout',
  GOOGLE_CALLBACK: '/callback',
  GITHUB_CALLBACK: '/callback',
} as const;

export const USER_ENDPOINTS = {
  USER_DETAIL: (identifier: string) => `/details/${identifier}`,
  FOLLOW_USER: (id: string) => `/${id}/follow/toggle`,
  CREATE_CHAT: '/chat', // Create a new chat userBId in body

  ACADEMIC_PROGRAMS: '/academicprograms/academicdetails',
  SEARCH_USERS: '/search',
  NOTIFICATIONS: '/notifications',

  // Communication
  NOTIFICATION_SUBSCRIBE: '/subscribe',
  GET_INBOX_PARTICIPANTS: '/getSecondParticipants',
  CHAT_ID: (id?: string) => `/chatid${id ? `/${id}` : ''}`,
  GET_MESSAGES_BY_CHAT_ID: '/messages',
  CHATS: '/chats',

  FEED: '/home/feed',
  GLOBAL_FEED: '/popular/feed',
} as const;

export const CENTER_ENDPOINTS = {
  COMMUNITY: '/community',
  COMMUNITY_BY_SLUG: (slug: string) => `/community/${slug}`,
  COMMUNITY_BY_ID: (id: string) => `/community/${id}`,
  UPDATE_COMMUNITY_AVATAR: (id: string) => `/community/${id}/avatar`,
  UPDATE_COMMUNITY_BANNER: (id: string) => `/community/${id}/banner`,

  COMMUNITY_POST: (id: string | number, postId?: string | number) =>
    `/communitypost/${id}${postId ? `/${postId}` : ''}`,
  COMMUNITY_POSTS: (id: string | number) => `/communitypost/${id}/posts`,

  COMMUNITY_FOLLOW_TOGGLE: (id: string | number) => `/community/${id}/follow/toggle`,
  COMMUNITY_FOLLOWS: (id?: string) => `/community/follows${id ? `/${id}` : ''}`,

  POST_VOTE: (postId: string, voteType: VoteEnum, communityId: string) =>
    `/communitypost/${communityId}/${postId}/vote/${voteType}`,
  POSTS: '/communityposts',
  POST: (communityId: string, oostIdSlug: string) => `communitypost/${communityId}/${oostIdSlug}`,
  POST_SAVE: (communityId: string, oostIdSlug: string) =>
    `communitypost/${communityId}/${oostIdSlug}/save`,
  POST_VIEW: (communityId: string, oostIdSlug: string) =>
    `communitypost/${communityId}/${oostIdSlug}/view`,

  POST_COMMENT: (id: string | number) => `/${id}`,
  COMMENT_VOTE: (id: string, voteType: VoteEnum) => `/${id}/vote/${voteType}`,
};

export const ADMIN_ENDPOINTS = {
  ACCESS_LOGS: '/accesslogs',
};

export const FORMAT_ENDPOINTS = {
  GET_STATES: '/allstates',
  GET_CITIES: '/allcities',
  GET_INTERESTS: '/userinterests',
} as const;

export const flatEndpointObjects = {
  ...AUTH_ENDPOINTS,
  ...USER_ENDPOINTS,
  ...FORMAT_ENDPOINTS,
  ...CENTER_ENDPOINTS,
  ...ADMIN_ENDPOINTS,
} as const;

const githubAuthBaseURL = BASE_URLS.githubAuth;
const googleAuthBaseURL = BASE_URLS.googleAuth;
export { githubAuthBaseURL, googleAuthBaseURL };
