import {
  LoginForm,
  LoginRegisterButton,
} from "@/_components/client/loginForm/loginForm";

export default function LoginPage() {
  return (
    <>
      <LoginForm />
      <div className="my-[15px] h-[1px] bg-mid-gray"></div>
      <LoginRegisterButton />
    </>
  );
}
