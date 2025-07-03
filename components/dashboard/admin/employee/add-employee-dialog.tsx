"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { customToast } from "@/components/custom-toast";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BASE_URL } from "@/constants";
import { useDepartments } from "@/hooks/use-department";
import { employeeSchema } from "@/validations/admin";
import {
  AtSign,
  Building2,
  Calendar,
  LetterText,
  MapPin,
  Mars,
  Phone,
  UserCog,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function AddEmployeeDialog() {
  const session = useSession();
  const companyId = session.data?.user.companyId as string;
  const { data: departments } = useDepartments(companyId);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      gender: undefined,
      dateOfBirth: "",
      image: "",
      departmentId: "",
      companyId: companyId ?? "",
      employeeRole: undefined,
      baseSalary: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (companyId) {
      form.setValue("companyId", companyId);
    }
  }, [companyId, form]);

  async function onSubmit(values: z.infer<typeof employeeSchema>) {
    setSubmitting(true);

    try {
      const res = await fetch(`${BASE_URL}/api/admin/employee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          phone: values.phone,
          address: values.address,
          gender: values.gender,
          dateOfBirth: values.dateOfBirth,
          image: values.image,
          companyId: values.companyId,
          departmentId: values.departmentId,
          employeeRole: values.employeeRole,
          baseSalary: values.baseSalary,
          isActive: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitting(false);
        setOpen(false);
        customToast("error", "Uh oh! Something went wrong 😵", data.message);
      } else {
        setSubmitting(false);
        setOpen(false);
        customToast("success", "Success 🎉", data.message);
        form.reset();
        router.push("/dashboard/admin/employee");
      }
    } catch (error) {
      setSubmitting(false);
      setOpen(false);
      console.error(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size={"sm"}
          className="bg-picton-blue-400 hover:bg-picton-blue-500 flex h-9 cursor-pointer items-center gap-2 px-3 text-xs text-white duration-200 xl:text-sm"
        >
          <Users size={16} />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[350px] rounded-md sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create Employee</DialogTitle>
          <DialogDescription>
            Add a new Employee data to this company.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <LetterText size={14} />
                      <div>
                        Name
                        <span className="ml-0.5 text-red-500">*</span>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g: Dimas Wibisana"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <AtSign size={14} />
                      <div>
                        Email
                        <span className="ml-0.5 text-red-500">*</span>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g: dimas@mail.com"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Phone size={14} />
                      Phone
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+62 811-1212-1313"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Calendar size={14} />
                      Date of Birth
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <MapPin size={14} />
                    Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Jl. Ikan Dori No.24"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Mars size={14} />
                      Gender
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Building2 size={14} />
                      Department
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments?.map((department) => (
                          <SelectItem
                            key={department.id}
                            value={String(department.id)}
                          >
                            {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employeeRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <UserCog size={14} />
                      <div>
                        Employee Role
                        <span className="ml-0.5 text-red-500">*</span>
                      </div>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MANAGER">Manager</SelectItem>
                        <SelectItem value="STAFF">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="baseSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Salary</FormLabel>
                  <FormControl>
                    <Input type="number" autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">
                    <div>
                      Password
                      <span className="ml-0.5 text-red-500">*</span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="password"
                      name="password"
                      className="w-full"
                      type={showPassword ? "text" : "password"}
                      placeholder={showPassword ? "Your Password" : "********"}
                      autoComplete="current-password"
                      onChange={(e) => {
                        field.onChange(e);
                        form.clearErrors("password");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="flex items-center justify-end gap-2 text-sm">
                    <Checkbox
                      id="showPassword"
                      onCheckedChange={() => setShowPassword((prev) => !prev)}
                    />
                    <Label htmlFor="showPassword">Show Password</Label>
                  </div>
                </FormItem>
              )}
            />
            <div className="mt-3 flex justify-end gap-2">
              <SubmitButton
                isSubmitting={submitting}
                className="bg-picton-blue-400 hover:bg-picton-blue-500 dark:text-foreground w-full max-w-[150px]"
              >
                {submitting ? "Creating" : "Create Employee"}
              </SubmitButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddEmployeeDialog;
