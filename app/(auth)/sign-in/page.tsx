import { SignInForm } from "@/components/auth/signin-form";

function SignInPage() {
  return (
    <div className="grid min-h-svh place-items-center max-md:m-4">
      <div className="w-full max-w-md">
        <SignInForm />
      </div>
    </div>
  );
}

export default SignInPage;
