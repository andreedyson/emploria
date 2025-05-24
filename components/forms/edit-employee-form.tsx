"use client";

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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BASE_URL } from "@/constants";
import { useDepartments } from "@/hooks/use-department";
import { EmployeeColumnProps } from "@/types/admin/employee";
import { editEmployeeSchema } from "@/validations/admin";
import {
  AtSign,
  BriefcaseBusiness,
  Building2,
  Calendar,
  ChevronLeft,
  LetterText,
  MapPin,
  Mars,
  Phone,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type EditEmployeeFormProps = {
  employeeData: EmployeeColumnProps;
};

function EditEmployeeForm({ employeeData }: EditEmployeeFormProps) {
  const { data: departments } = useDepartments(
    employeeData.company?.id as string,
  );
  const [submitting, setSubmitting] = useState<boolean>(false);

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
      position: employeeData.position,
      employeeRole: employeeData.employeeRole,
    },
  });

  useEffect(() => {
    if (employeeData.company?.id) {
      form.setValue("companyId", employeeData.company.id);
    }
  }, [employeeData.company?.id, form]);

  async function onSubmit(values: z.infer<typeof editEmployeeSchema>) {
    setSubmitting(true);

    try {
      const res = await fetch(`${BASE_URL}/api/admin/employee`, {
        method: "PUT",
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
          position: values.position,
          employeeRole: values.employeeRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitting(false);
        customToast("error", "Uh oh! Something went wrong 😵", data.message);
      } else {
        setSubmitting(false);
        customToast("success", "Success 🎉", data.message);
        router.push("/dashboard/admin/employee");
      }
    } catch (error) {
      setSubmitting(false);
      console.error(error);
    }
  }

  return (
    <div className="space-y-4">
      <Link
        href={"/dashboard/admin/employee"}
        className="flex items-center gap-1 duration-200 hover:underline"
      >
        <ChevronLeft size={14} strokeWidth={2} />
        <p>Back</p>
      </Link>
      {/* Create Employee Page Header */}
      <div>
        <h2 className="text-lg font-semibold">Update Employee</h2>
        <p className="text-muted-foreground text-base">
          Edit an existing employee data in this company.
        </p>
      </div>

      {/* Edit Employee Form */}
      <div className="max-w-2xl">
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
                      Name
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
                      Email
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
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Calendar size={14} />
                      Date of Birth (YYYY-MM-DD)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g: 2004-12-13"
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
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <BriefcaseBusiness size={14} />
                      Position
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g: Finance"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      Employee Role
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
      </div>
    </div>
  );
}

export default EditEmployeeForm;
