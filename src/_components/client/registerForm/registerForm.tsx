"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { HeadingLarge } from "@/_components/ui/headings/headingLarge";
import { HeadingMedium } from "@/_components/ui/headings/headingMedium";
import { TextField } from "@/_components/ui/textfield";
import { Button } from "@/_components/ui/button";
import { GoBackButton } from "../../ui/goBackButton/goBackButton";
import { type RegisterAsCollaboratorForm } from "./interfaces";
import { registerAsCollaboratorSchema } from "./schemas/registerAsCollaborator.schema";
import { type FocusEvent } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/_components/ui/tooltip";
import { useToast } from "@/_components/ui/use-toast";
import {
  createCollaboratorUser,
  registerAsCollaborator,
} from "@/_components/client/registerForm/actions/register";

const RegisterForm = () => {
  const searchParams = useSearchParams();
  const businessId = searchParams.get("businessId");
  const businessAdminId = searchParams.get("businessAdminId");

  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterAsCollaboratorForm>({
    resolver: zodResolver(registerAsCollaboratorSchema),
  });
  const picture = watch("files");

  const removeHyphens = (e: FocusEvent<HTMLInputElement>) => {
    const cuilWithoutHyphens = e.target.value.replace(/-/g, "");
    setValue("cuil", cuilWithoutHyphens);
  };

  const handleRegistration = async (newUser: RegisterAsCollaboratorForm) => {
    const formData = new FormData();

    Object.entries(newUser).forEach(([key, value]) => {
      if (value !== undefined && key !== "files") {
        // eslint-disable-next-line
        formData.append(key, value);
      }
    });

    if (newUser.files && newUser.files.length > 0) {
      const filesArray = Array.from(newUser.files);
      filesArray.forEach((file) => {
        formData.append("files", file);
      });
    }

    if (businessId && businessAdminId) {
      formData.append("businessId", businessId);
      formData.append("businessAdminId", businessAdminId);
      await createCollaboratorUser(formData);
    } else {
      await registerAsCollaborator(formData);
    }

    toast({
      title: "Registro exitoso!",
      description: businessId
        ? "Cuenta de colaborador creada"
        : "Tu cuenta en FidoBot como colaborador fue creada",
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleRegistration)}
      className="flex flex-col gap-4 rounded-30 bg-secondary-purple px-8 py-5 md:gap-[40px] lg:px-28 lg:py-8 xl:px-[120px] xl:py-[40px]"
    >
      <HeadingLarge className="text-center text-f-black">
        {businessId
          ? "Crear cuenta de colaborador"
          : "Registrarme como colaborador"}
      </HeadingLarge>

      <div className="grid grid-cols-3 gap-10 lg:gap-[60px] ">
        <div className="col-span-3 flex flex-col gap-[15px] md:col-span-1">
          <HeadingMedium className="text-f-black">
            Mis datos personales
          </HeadingMedium>
          <TextField
            label="Nombre"
            placeholder="nombre"
            id="firstName"
            {...register("firstName")}
            error={errors.firstName?.message}
          />
          <TextField
            label="Apellido"
            placeholder="apellido"
            id="lastName"
            {...register("lastName")}
            error={errors.lastName?.message}
          />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger type="button">
                <TextField
                  label="CUIL"
                  placeholder="cuil"
                  id="cuil"
                  {...register("cuil")}
                  error={errors.cuil?.message}
                  onBlur={removeHyphens}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>El CUIL debe ir sin guiones</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TextField
            label="Fecha de nacimiento"
            placeholder="fecha de nacimiento"
            id="birthday"
            type="date"
            {...register("birthday")}
            error={errors.birthday?.message}
          />
          <TextField
            label="Ciudad"
            placeholder="ciudad"
            id="city"
            {...register("city")}
            error={errors.city?.message}
          />
          <TextField
            label="País"
            placeholder="pais"
            id="country"
            {...register("country")}
            error={errors.country?.message}
          />
        </div>

        <div className="col-span-3 flex flex-col gap-[15px] md:col-span-1">
          <HeadingMedium className="text-f-black">
            Datos de mi cuenta
          </HeadingMedium>
          <TextField
            label="Email"
            placeholder="email"
            id="email"
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                type="button"
                className=" items-center gap-2 text-f-black"
              >
                {/* <p>+54</p> */}
                <TextField
                  label="Teléfono"
                  placeholder="telefono"
                  id="phoneNumber"
                  {...register("phoneNumber")}
                  error={errors.phoneNumber?.message}
                  defaultValue="+54"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  El numero debe tener el codigo de area seguido del numero sin
                  el 15
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TextField
            label="Contraseña"
            placeholder="contraseña"
            type="password"
            id="password"
            {...register("password")}
            error={errors.password?.message}
          />
          <TextField
            label="Repetir contraseña"
            placeholder="Repetir contraseña"
            type="password"
            id="repeatPassword"
            {...register("repeatPassword")}
            error={errors.repeatPassword?.message}
          />
        </div>

        <div className="col-span-3 flex flex-col gap-[15px] md:col-span-1 ">
          <HeadingMedium className="text-f-black">Añadir foto</HeadingMedium>
          <div className="relative h-[170px] w-[170px] self-center rounded-full bg-light-gray md:self-start lg:h-[240px] lg:w-[240px]">
            {picture && picture?.length > 0 && (
              <Image
                src={URL.createObjectURL(picture[0]!)}
                alt="profile picture preview"
                fill
                className="rounded-full"
              />
            )}
          </div>

          <input
            id="file"
            type="file"
            className="hidden"
            {...register("files")}
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById("file")?.click()}
            type="button"
          >
            Añadir imagen
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-[60px]">
        <GoBackButton variant="outline" type="button">
          Atrás
        </GoBackButton>
        <Button type="submit">Crear cuenta</Button>
      </div>
    </form>
  );
};

export { RegisterForm };
