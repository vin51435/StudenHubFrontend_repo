const appConfig = {
  user: {
    passwordMinLength: 6,
    passwordMaxLength: 20,
  },
  app: {
    otpLength: 5,
    otpResend: 30,
  },
} as const;

export default appConfig;
