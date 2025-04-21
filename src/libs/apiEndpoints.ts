// src/lib/api/endpoints.ts

export const activeHost =
  import.meta.env.VITE_NODE_ENV === 'development'
    ? import.meta.env.VITE_DEV_BACKEND_DEV
    : import.meta.env.VITE_DEV_BACKEND_PROD;

export const BASE_URLS = {
  googleAuth: `${activeHost}/oauth2/google`,
  githubAuth: `${activeHost}/oauth2/github`,
  auth: `${activeHost}/api/v1/auth`,
  user: `${activeHost}/api/v1/user`,
  userFormats: `${activeHost}/api/v1/userformat`,
} as const;

export const AUTH_ENDPOINTS = {
  USER_INFO: '/info',
  USER_EMAIL_REG: '/emailReg',
  USER_EMAIL_VERIFY: '/emailVerify',
  USER_SIGNUP: '/signup',
  USER_SIGNUP_DETAILS: '/signupdetails',
  USER_SIGNUP_INTEREST: '/signupinterest',
  USER_FORGOT_PASSWORD: '/forgotPassword',
  USER_LOGIN: '/login',
  GOOGLE_CALLBACK: '/callback',
  GITHUB_CALLBACK: '/callback',
} as const;

export const USER_ENDPOINTS = {
  ACADEMIC_PROGRAMS: '/academicprograms/academicdetails',
  SEARCH_USERS: '/search',
  NOTIFICATIONS: '/notifications',

  // Communication
  GET_INBOX_PARTICIPANTS: '/getSecondParticipants',
  USERS_BY_ID: '/usersbyid',
  CHAT_ID: '/chatid',
  GET_MESSAGES_BY_CHAT_ID: '/messages',
  CHATS: '/chats',
} as const;

export const FORMAT_ENDPOINTS = {
  GET_STATES: '/allstates',
  GET_CITIES: '/allcities',
  GET_INTERESTS: '/userinterests',
} as const;

export const POST_ENDPOINTS = {
  ALL: '/posts',
  SINGLE: (id: string | number) => `/posts/${id}`,
  CREATE: '/posts',
  UPDATE: (id: string | number) => `/posts/${id}`,
  DELETE: (id: string | number) => `/posts/${id}`,
} as const;

export const flatEndpointObjects = {
  ...AUTH_ENDPOINTS,
  ...USER_ENDPOINTS,
  ...FORMAT_ENDPOINTS,
} as const;

const githubAuthBaseURL = BASE_URLS.githubAuth;
const googleAuthBaseURL = BASE_URLS.googleAuth;
export { githubAuthBaseURL, googleAuthBaseURL };
