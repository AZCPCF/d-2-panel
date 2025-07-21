import { z } from "zod";
import { persianString } from ".";
export const birthDateSchema = z.object({
  title: persianString(4),
  date: persianString(),
});
export type BirthDateSchema = z.infer<typeof birthDateSchema>;