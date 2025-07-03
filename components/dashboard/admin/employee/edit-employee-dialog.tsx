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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { BASE_URL } from "@/constants";
import { useDepartments } from "@/hooks/use-department";
import { EmployeeColumnProps } from "@/types/admin/employee";
import { editEmployeeSchema } from "@/validations/admin";
import {
  AtSign,
  Building2,
  Calendar,
  LetterText,
  MapPin,
  Mars,
  Pencil,
  Phone,
  UserCog,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type EditEmployeeDialogProps = {
  employeeData: EmployeeColumnProps;
};

function EditEmployeeDialog({ employeeData }: EditEmployeeDialogProps) {
  const session = useSession();
  const companyId = session.data?.user.companyId as string;
  const { data: departments } = useDepartments(companyId);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof editEmployeeSchema>>({
    resolver: zodResolver(editEmployeeSchema),
    defaultValues: {
      name: employeeData.name,
      email: employeeData.email,
      phone: employeeData.phone ?? "",
      address: employeeData.address ?? "",
      gender:
        employeeData.gender === "MALE" || employeeData.gender === "FEMALE"
          ? employeeData.gender
          : undefined,
      dateOfBirth: employeeData.dateOfBirth
        ? employeeData.dateOfBirth.toISOString().split("T")[0]
        : "",
      image: "",
      departmentId: employeeData.department?.id,
      companyId: employeeData.company?.id ?? "",
      employeeRole: employeeData.employeeRole,
      isActive: employeeData.isActive,
    },
  });

  useEffect(() => {
    form.reset({
      name: employeeData.name,
      email: employeeData.email,
      phone: employeeData.phone ?? "",
      address: employeeData.address ?? "",
      gender:
        employeeData.gender === "MALE" || employeeData.gender === "FEMALE"
          ? employeeData.gender
          : undefined,
      dateOfBirth: employeeData.dateOfBirth
        ? employeeData.dateOfBirth.toISOString().split("T")[0]
        : "",
      image: "",
      departmentId: employeeData.department?.id,
      companyId: employeeData.company?.id ?? "",
      employeeRole: employeeData.employeeRole,
      baseSalary: employeeData.baseSalary,
      isActive: employeeData.isActive,
    });
  }, [employeeData, form]);

  async function onSubmit(values: z.infer<typeof editEmployeeSchema>) {
    setSubmitting(true);

    try {
      const res = await fetch(`${BASE_URL}/api/admin/employee`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: employeeData.userId,
          name: values.name,
          email: values.email,
          phone: values.phone,
          address: values.address,
          gender: values.gender,
          dateOfBirth: values.dateOfBirth,
          image: values.image,
          companyId: values.companyId,
          departmentId: values.departmentId,
          employeeRole: values.employeeRole,
          baseSalary: values.baseSalary,
          isActive: values.isActive,
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
          size={"icon"}
          className="flex cursor-pointer items-center gap-2 bg-yellow-500 text-white duration-200 hover:bg-yellow-600"
        >
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[350px] rounded-md sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Update Employee</DialogTitle>
          <DialogDescription>
            Edit an existing employee data in this company.
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
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Is Active</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

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

            <div className="mt-3 flex justify-end gap-2">
              <SubmitButton
                isSubmitting={submitting}
                className="dark:text-foreground w-full max-w-[150px] bg-yellow-400 hover:bg-yellow-500"
              >
                {submitting ? "Editing" : "Edit Employee"}
              </SubmitButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditEmployeeDialog;
