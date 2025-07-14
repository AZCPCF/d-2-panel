import { z } from "zod";
export const phoneSchema = z.object({
  phone_number: z.string().regex(/^09\d{9}$/, {
    message: "فرمت شماره تماس معتبر نمی باشد",
  }),
});

export const otpSchema = z
  .string()
  .length(6, { message: "کد تایید باید ۶ رقم باشد" });

export const newUserSchema = z.object({
  referral: z.string().optional(),
  full_name: z
    .string()
    .min(2, "نام کامل باید حداقل ۲ حرف باشد")
    .max(50, "نام کامل نمی‌تواند بیشتر از ۵۰ حرف باشد"),
  otp: z
    .string()
    .length(6, "کد تایید باید ۶ رقم باشد")
    .regex(/^\d+$/, "کد تایید باید فقط شامل اعداد باشد"),
});
