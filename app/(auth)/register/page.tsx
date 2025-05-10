import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh place-items-center">
      <div className="w-full max-w-lg">
        <RegisterForm />
      </div>
    </div>
  );
}
