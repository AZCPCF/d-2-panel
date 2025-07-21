import { z } from "zod/v4";

export function persianString(min: number = 1) {
  return z
    .string({ error: "این فیلد الزامی است" })
    .min(min, "این فیلد نمی‌تواند خالی باشد");
}
