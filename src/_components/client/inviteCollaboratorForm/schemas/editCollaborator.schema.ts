import { z } from "zod";

export const editCollaboratorSchema = z.object({
  user: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email({ message: "El email no es válido" }),
    phoneNumber: z
      .string()
      .refine(
        (value) => {
          const e164Regex = /^\+[1-9]\d{1,14}$/;
          return e164Regex.test(value);
        },
        {
          message: "El número de teléfono debe ser E.164 standard",
        },
      )
      .optional(),
  }),
  business: z.object({
    labels: z.array(z.string()).optional(),
  }),
});
