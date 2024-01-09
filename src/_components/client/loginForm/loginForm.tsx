"use client";

import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase-config";
import { LoginForm } from "./interfaces";
import { HeadingLarge } from "@/_components/ui/headings/headingLarge";
import { TextField } from "@/_components/ui/textfield";
import { Button } from "@/_components/ui/button";
import { useState } from "react";

const LoginForm = () => {
  const [isLoading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<LoginForm>();
  const router = useRouter();

  const submitLogin = async (data: LoginForm) => {
    try {
      setLoading(true);

      const userCred = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      const token = await userCred.user.getIdToken();

      if (!token) {
        throw new Error("Get id token failed");
      }

      const response = await fetch("api/auth", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        reset();
        router.push("/dashboard");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-4 md:min-w-[250px]"
      onSubmit={handleSubmit(submitLogin)}
    >
      <HeadingLarge className="text-center">Iniciar Sesión</HeadingLarge>
      <TextField
        label="Email"
        placeholder="email"
        id="email"
        {...register("email")}
      />
      <TextField
        label="Contraseña"
        placeholder="contraseña"
        id="password"
        type="password"
        {...register("password")}
      />
      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading ? "cargando..." : "Ingresar"}
      </Button>
    </form>
  );
};

const LoginRegisterButton = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <Button
        className="w-full"
        variant="outline"
        onClick={() => router.push("/register")}
      >
        Registrarme como colaborador
      </Button>
      <Button className="w-full" onClick={() => router.push("/use-fidooo")}>
        Quiero usar Fido en mi negocio
      </Button>
      <Button className="w-full" variant="ghost" type="button">
        Olvidé mi contraseña
      </Button>
    </div>
  );
};

export { LoginForm, LoginRegisterButton };
