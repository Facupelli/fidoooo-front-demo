import { z } from "zod";

export const registerAsCollaboratorSchema = z
  .object({
    firstName: z.string().min(1, { message: "Este campo es requerido" }),
    lastName: z.string().min(1, { message: "Este campo es requerido" }),
    cuil: z
      .string()
      .min(11, { message: "El cuil no es válido" })
      .max(11, { message: "El cuil no es válido" }),
    birthday: z.string(),
    city: z.string().min(1, { message: "Este campo es requerido" }),
    country: z.string().min(1, { message: "Este campo es requerido" }),
    email: z.string().email({ message: "El email no es válido" }),
    phoneNumber: z.string().refine(
      (value) => {
        const e164Regex = /^\+[1-9]\d{1,14}$/;
        return e164Regex.test(value);
      },
      {
        message: "El número de teléfono debe ser E.164 standard",
      },
    ),
    password: z
      .string()
      .min(8, { message: "Este campo debe tener 8 caracteres como minimo" }),
    repeatPassword: z
      .string()
      .min(8, { message: "Este campo debe tener 8 caracteres como minimo" }),
    files: z
      .any()
      // .refine((files: File[]) => files.length == 1, "Image is required.")
      .optional(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Las contraseñas deben coincidir",
    path: ["repeatPassword"],
  });
