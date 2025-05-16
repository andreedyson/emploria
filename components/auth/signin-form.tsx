"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/validations";
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
import { Inter, Lexend } from "next/font/google";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
      router.replace("/dashboard/user");
    }

    if (isAutheticated && systemRole == "SUPER_ADMIN_COMPANY") {
      router.replace("/dashboard/admin");
    }

    if (isAutheticated && systemRole == "SUPER_ADMIN") {
      router.replace("/dashboard/super-admin");
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
    <div className="rounded-xl border px-4 py-6 shadow-lg md:px-8 md:py-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={`flex flex-col gap-4 ${inter.className}`}
        >
          <section className="mb-2 text-center">
            <Link
              href="/"
              className={`mb-3 flex items-center justify-center gap-2 text-2xl font-bold md:text-3xl ${lexend.className}`}
            >
              <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-md">
                <Image
                  src={"/assets/emploria-logo.svg"}
                  width={80}
                  height={80}
                  alt="Emploria Logo"
                />
              </div>
              Emploria
            </Link>
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-lg font-bold md:text-xl">Welcome Back 👋</h2>
              <p className="text-muted-foreground max-w-[300px] text-sm">
                Let&apos;s get back to tracking your data, salaries, and leave
                entitlements.
              </p>
            </div>
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
          <div>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-picton-blue-500 hover:bg-picton-blue-700 w-full cursor-pointer duration-200"
            >
              {submitting ? "Signing In..." : "Sign In"}
            </Button>
            <p className="my-2 grid w-full place-items-center text-center">
              OR
            </p>
            <Button
              type="button"
              disabled={submitting}
              className="w-full cursor-pointer"
            >
              Sign In with Google
            </Button>
          </div>
          <Link href={"/register"} className="mt-2 text-center text-sm">
            Don&apos; have an account?{" "}
            <span className="text-main-500 font-semibold underline">
              Register
            </span>
          </Link>
        </form>
      </Form>
    </div>
  );
}
