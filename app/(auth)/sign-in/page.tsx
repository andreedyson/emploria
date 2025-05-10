import { SignInForm } from "@/components/auth/signin-form";
import Image from "next/image";
import React from "react";

function SignInPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <Image
          width={1000}
          height={1000}
          src="/assets/image-placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <SignInForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
