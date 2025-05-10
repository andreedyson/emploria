"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/types/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { customToast } from "../custom-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

export function SignInForm() {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();
  const session = useSession();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const isAutheticated = session.status === "authenticated";
    const systemRole = session.data?.user.role;

    if (isAutheticated && systemRole == "USER") {
      router.replace("/");
    }

    if (
      isAutheticated &&
      (systemRole == "SUPER_ADMIN" || systemRole == "ADMIN")
    ) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setSubmitting(true);

    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (!res?.ok) {
        setSubmitting(false);
        customToast("error", "Invalid credentials provided");
        setSubmitting(false);
      } else {
        setSubmitting(false);
        customToast("success", "Login Successful");
        router.refresh();
        router.push("/");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setSubmitting(false);
      toast.error("Unexpected error occurred 😵");
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <section className="mb-2 text-center md:text-start">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md">
                <Image
                  src={"/assets/emploria-logo.svg"}
                  width={80}
                  height={80}
                  alt="Emploria Logo"
                />
              </div>
              Emploria
            </Link>
            <p className="mt-2.5 mb-3 text-sm font-bold tracking-wide uppercase">
              Sign In
            </p>
            <h2 className="text-xl font-bold md:text-2xl">Welcome Back 🙋‍♂️</h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Fill out the form below to securely access your dashboard and
              continue with ease.
            </p>
          </section>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <div className="border-input flex items-center justify-center rounded-md border dark:bg-zinc-700">
                  <Mail size={24} className="mx-2" />
                  <FormControl>
                    <Input
                      placeholder="user@mail.com"
                      {...field}
                      autoComplete="off"
                      className="rounded-l-none"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="border-input relative flex items-center justify-center rounded-md border dark:bg-zinc-700">
                  <Lock size={24} className="mx-2" />
                  <FormControl>
                    <Input
                      placeholder={showPassword ? "Your Password" : "******"}
                      {...field}
                      autoComplete="off"
                      type={showPassword ? "text" : "password"}
                      className="rounded-l-none"
                    />
                  </FormControl>
                  <div
                    className="desc-2 absolute right-3 cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {!showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full cursor-pointer"
          >
            {submitting ? "Signing In..." : "Sign In"}
          </Button>

          <div className="my-1 flex items-center gap-4">
            <div className="bg-primary/20 dark:bg-primary-foreground/80 h-0.5 w-1/2" />
            <div>OR</div>
            <div className="bg-primary/20 dark:bg-primary-foreground/80 h-0.5 w-1/2" />
          </div>

          {/* Google SignIn Button */}
          <div>
            <Button
              className="w-full cursor-pointer bg-zinc-700 text-white hover:bg-zinc-500"
              onClick={(e) => {
                e.preventDefault();
                signIn("google");
              }}
            >
              <Image
                src={"/assets/google.svg"}
                width={1000}
                height={1000}
                alt="Google"
                className="mr-2 size-4"
              />
              Sign In with Google
            </Button>
          </div>
          <Link href={"/register"} className="mt-2 text-center text-sm">
            Don&apos;t have an account?{" "}
            <span className="text-main-500 font-semibold underline">
              Register
            </span>
          </Link>
          <div className="mt-3 text-center text-sm md:mt-10 md:text-start">
            <p>© 2025 Emploria</p>
          </div>
        </form>
      </Form>
    </div>
  );
}
