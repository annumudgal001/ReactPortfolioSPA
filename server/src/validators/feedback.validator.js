import { z } from "zod";

export const feedbackInputSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  rating: z.coerce.number().int().min(1, "Choose a rating").max(5),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(1000),
  // Honeypot: hidden field that real people never fill in
  website: z.string().default(""),
});
