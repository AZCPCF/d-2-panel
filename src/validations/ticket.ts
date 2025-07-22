import { z } from "zod";
import { persianString } from ".";

export const TicketSchema = z.object({
  title: persianString(),
  question: persianString(),
  file: z.file({ error: "فایل نامعتبر است." }).nullable(),
});

export const TicketMessageSchema = z.object({
  answer: persianString(),
  file: z.file({ error: "فایل نامعتبر است." }).nullable(),
});
