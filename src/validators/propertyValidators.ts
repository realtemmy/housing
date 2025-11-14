import { z } from "zod";

export const propertyValidator = z.object({
  title: z.string(),
  description: z
    .string()
    .max(150, "Description should not ne more than 150 words.")
    .optional(),
  type: z.enum(["APARTMENT", "HOUSE", "HOSTEL"]),
  ownerId: z.uuid(),
});
