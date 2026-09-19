import * as z from "zod";

// ==========================================
// 1. Schema (Login)
// ==========================================
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email address is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});

// ==========================================
// 2. Schemas (Signup / Register)
// ==========================================

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: "First name is required" })
      .min(2, { message: "First name must be at least 2 characters" }),
    lastName: z
      .string()
      .min(1, { message: "Last name is required" })
      .min(2, { message: "Last name must be at least 2 characters" }),
    email: z
      .string()
      .min(1, { message: "Email address is required" })
      .email({ message: "Invalid email address" }),
    phone: z
      .string()
      .min(1, { message: "Phone number is required" })
      .regex(/^01[0125][0-9]{8}$/, { message: "Invalid phone number" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const registerOtpSchema = z.object({
  otp: z
    .string()
    .min(1, { message: "Verification code is required" })
    .length(6, { message: "Verification code must be 6 digits" }),
});

// ==========================================
// 3. Schemas (Forgot Password)
// ==========================================

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email address is required" })
    .email({ message: "Invalid email address" }),
});

export const verifyForgotPasswordSchema = z.object({
  otp: z
    .string()
    .min(1, { message: "Verification code is required" })
    .length(6, { message: "Verification code must be 6 digits" }),
  newPassword: z
    .string()
    .min(1, { message: "New password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
});