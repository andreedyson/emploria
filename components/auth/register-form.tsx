"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BASE_URL } from "@/constants";
import { registerSchema } from "@/types/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Map,
  PersonStanding,
  Phone,
  UserRound,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import Image from "next/image";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export function RegisterForm() {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();
  const session = useSession();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      address: "",
      phone: "",
      dateOfBirth: "",
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

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setSubmitting(true);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          address: values.address,
          gender: values.gender,
          dateOfBirth: values.dateOfBirth,
          password: values.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitting(false);

        customToast("error", "Something went wrong 😵", data.message);
      } else {
        setSubmitting(false);
        customToast("success", "Success 🌟", data.message);
        form.reset();
        router.push("/");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setSubmitting(false);
      customToast("error", "Unexpected error occured 😵");
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
              <h2 className="text-lg font-bold md:text-xl">
                Create your account 🙋‍♂️
              </h2>
              <p className="text-muted-foreground max-w-[300px] text-sm">
                Start managing your company employees data with Emploria
              </p>
            </div>
          </section>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <div className="border-input flex items-center justify-center rounded-md border dark:bg-zinc-700">
                  <UserRound size={24} className="mx-2" />
                  <FormControl>
                    <Input
                      placeholder="ex: Andre Edyson"
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
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <div className="border-input flex items-center justify-center rounded-md border dark:bg-zinc-700">
                    <Phone size={24} className="mx-2" />
                    <FormControl>
                      <Input
                        placeholder="0812-1212-1313"
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <div className="border-input flex items-center justify-center rounded-md border dark:bg-zinc-700">
                    <Map size={24} className="mx-2" />
                    <FormControl>
                      <Input
                        placeholder="e.g.: Jl. Ikan Baung"
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
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="gender">Gender</FormLabel>
                  <div className="border-input flex items-center justify-center rounded-md border dark:bg-zinc-700">
                    <PersonStanding size={24} className="mx-2" />
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <SelectTrigger
                          id="gender"
                          className="w-full"
                          aria-label="Select Gender"
                        >
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <div className="border-input flex items-center justify-center rounded-md border dark:bg-zinc-700">
                    <Calendar size={24} className="mx-2" />
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g.: 2 Jun 1998"
                        autoComplete="off"
                        className="rounded-l-none"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
            className="bg-picton-blue-500 hover:bg-picton-blue-700 mt-2 w-full cursor-pointer duration-200"
          >
            {submitting ? "Registering..." : "Register"}
          </Button>
          <Link href={"/"} className="mt-2 text-center text-sm">
            Already have an account?{" "}
            <span className="text-main-500 font-semibold underline">
              Sign In
            </span>
          </Link>
        </form>
      </Form>
    </div>
  );
}
