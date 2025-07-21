import { z } from "zod";
import { persianString } from ".";
const iranPhoneNumber = z.string().regex(/^09\d{9}$/, {
  message: "شماره موبایل معتبر نیست. باید با 09 شروع شود و 11 رقم باشد.",
});
const postalCode = z.string().regex(/^\d{10}$/, {
  message: "کد پستی باید دقیقاً 10 رقم باشد.",
});
export const addressSchemaSelf = z.object({
  title: persianString(),
  text: persianString(),
  province: persianString(),
  city: persianString(),
  postal_code: postalCode,
});

export const addressSchemaOther = z.object({
  title: persianString(),
  text: persianString(),
  province: persianString(),
  city: persianString(),
  postal_code: postalCode,
  full_name: persianString(),
  phone_number: iranPhoneNumber,
});
