import { z } from "zod";
export const phoneSchema = z.object({
  phone_number: z.string().regex(/^09\d{9}$/, {
    message: "فرمت شماره تماس معتبر نمی باشد",
  }),
});

export const otpSchema = z
  .string()
  .length(6, { message: "کد تایید باید ۶ رقم باشد" });
