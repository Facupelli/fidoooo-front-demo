"use client";

import { Button } from "@/_components/ui/button";
import { HeadingLarge } from "@/_components/ui/headings/headingLarge";
import { TextField } from "@/_components/ui/textfield";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface useFidoooForm {
  businessName: string;
  website: string;
  contactPhone: string;
  email: string;
  description: string;
}

export default function UseFidoooPage() {
  const { register, handleSubmit, reset } = useForm<useFidoooForm>();
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleUseFidooo = (data: useFidoooForm) => {
    console.log(data);

    reset();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-14 md:min-h-[300px] md:min-w-[250px]">
        <HeadingLarge className="text-center">
          ¡Muchas gracias! Nos comunicaremos contigo
        </HeadingLarge>

        <Button
          className="w-full"
          type="button"
          onClick={() => router.push("/dashboard")}
        >
          Volver al sitio
        </Button>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-4 md:min-w-[250px]"
      onSubmit={handleSubmit(handleUseFidooo)}
    >
      <HeadingLarge className="text-center">
        Cuéntanos sobre tu negocio
      </HeadingLarge>

      <TextField
        label="Nombre de tu negocio"
        placeholder="nombre de tu negocio"
        {...register("businessName")}
      />

      <TextField
        label="Sitio web (opcional)"
        placeholder="sitio web"
        {...register("website")}
      />

      <TextField
        label="Telefono de contacto"
        placeholder="telefono de contacto"
        {...register("contactPhone")}
      />

      <TextField label="Email" placeholder="email" {...register("email")} />

      <TextField
        label="Descripcion"
        placeholder="descripcion"
        {...register("description")}
      />

      <Button className="w-full" type="submit">
        Enviar
      </Button>
    </form>
  );
}
