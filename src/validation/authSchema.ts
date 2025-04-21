import appConfig from '@src/config/appConfig';
import { Gender, UserType } from '@src/types/enum';
import { z } from 'zod';

export const login1FormSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email('Enter a valid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(
      appConfig.user.passwordMinLength,
      `Password must be at least ${appConfig.user.passwordMinLength} characters`
    )
    .max(
      appConfig.user.passwordMaxLength,
      `Password must not exceed ${appConfig.user.passwordMaxLength} characters`
    ),
});

export type FormLogin1Schema = z.infer<typeof login1FormSchema>;

export const passwordResetSchema = z.object({
  email: z.string({ required_error: 'Enter your email' }).email('Enter a valid email address'),
});

export type FormPassowrdResetSchema = z.infer<typeof passwordResetSchema>;

export const signupSchema = z
  .object({
    email: z.string({ required_error: 'Email is required' }).email('Enter a valid email address'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(
        appConfig.user.passwordMinLength,
        `Password must be at least ${appConfig.user.passwordMinLength} characters`
      )
      .max(
        appConfig.user.passwordMaxLength,
        `Password must not exceed ${appConfig.user.passwordMaxLength} characters`
      ),
    passwordConfirm: z
      .string({ required_error: 'Confirm Password is required' })
      .min(
        appConfig.user.passwordMinLength,
        `Password must be at least ${appConfig.user.passwordMinLength} characters`
      )
      .max(
        appConfig.user.passwordMaxLength,
        `Password must not exceed ${appConfig.user.passwordMaxLength} characters`
      ),
    firstName: z.string().min(1, 'Enter your first name.'),
    lastName: z.string().min(1, 'Enter your last name.'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'], // Error will show under passwordConfirm field
  });

export type SignupFormSchema = z.infer<typeof signupSchema>;

export const emailVerificationSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email('Enter a valid email address'),
});

export type EmailVerificationSchema = z.infer<typeof emailVerificationSchema>;

export const emailCodeVerificationSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email('Enter a valid email address'),
  otp: z
    .string()
    .min(1, 'Please enter the valid OTP.')
    .max(appConfig.app.otpLength, 'Invalid OTP')
    .regex(/^\d+$/, 'Verification code must be a number'),
});

export type EmailCodeVerificationSchema = z.infer<typeof emailCodeVerificationSchema>;

export const signupDetailsSchema = z.object({
  gender: z
    .nativeEnum(Gender, {
      errorMap: () => ({ message: 'Gender is required' }),
    })
    .refine((value) => Object.values(Gender).includes(value), {
      message: 'Gender must be either male, female, or other',
    }),
  userType: z
    .nativeEnum(UserType, {
      errorMap: () => ({ message: 'User type is required' }),
    })
    .refine((value) => Object.values(UserType).includes(value), {
      message: 'Invalid user type',
    }),
  institute: z
    .string({ required_error: 'Enter your institute' })
    .min(1, 'Institute name is required'),
  currentCity: z.string({ required_error: 'Enter you City' }).min(1, 'Current city is required'),
});

export type SignupDetailsSchema = z.infer<typeof signupDetailsSchema>;
