"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { useState } from "react";
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
import { BASE_URL, months } from "@/constants";
import { useEmployee } from "@/hooks/use-employee";
import { salarySchema } from "@/validations/admin";
import { Banknote } from "lucide-react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";

type AddSalaryDialogProps = {
  companyId: string;
};

function AddSalaryDialog({ companyId }: AddSalaryDialogProps) {
  const { data: employees } = useEmployee(companyId);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const availableMonths = months.filter((m) => {
    return Number(m.value) <= currentMonth;
  });

  const form = useForm<z.infer<typeof salarySchema>>({
    resolver: zodResolver(salarySchema),
    defaultValues: {
      employeeId: "",
      month: "",
      year: new Date().getFullYear().toString(),
      bonus: 0,
      deduction: 0,
    },
  });

  const selectedEmployeeId = form.watch("employeeId");
  const selectedEmployee = employees?.find(
    (emp) => emp.id === selectedEmployeeId,
  );

  async function onSubmit(values: z.infer<typeof salarySchema>) {
    setSubmitting(true);

    try {
      const res = await fetch(`${BASE_URL}/api/admin/salary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: values.employeeId,
          month: values.month,
          year: values.year,
          bonus: values.bonus,
          deduction: values.deduction,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitting(false);
        customToast("error", "Uh oh! Something went wrong 😵", data.message);
      } else {
        setOpen(false);
        setSubmitting(false);
        customToast("success", "Success 🎉", data.message);
        queryClient.invalidateQueries({ queryKey: ["employee-salaries"] });
        form.reset();
        router.refresh();
      }
    } catch (error) {
      setOpen(false);
      setSubmitting(false);
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
          <Banknote size={16} />
          Add Salary
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[350px] rounded-md sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Payslip</DialogTitle>
          <DialogDescription>
            Generate a new payslip for an employee.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Employee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees?.map((employee) => (
                        <SelectItem
                          key={employee.id}
                          value={String(employee.id)}
                        >
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Month</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableMonths.map((month) => (
                          <SelectItem
                            key={month.value}
                            value={String(month.value)}
                          >
                            {month.label}
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
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g: 2025"
                        autoComplete="off"
                        readOnly
                        className="read-only:bg-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="bonus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bonus</FormLabel>
                    <FormControl>
                      <Input type="number" autoComplete="off" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deduction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deduction</FormLabel>
                    <FormControl>
                      <Input type="number" autoComplete="off" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-2">
              <Label>Base Salary</Label>
              <Input
                autoComplete="off"
                value={
                  selectedEmployee?.baseSalary?.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }) ?? "-"
                }
                readOnly
                className="read-only:bg-gray-200"
              />
            </div>

            <DialogFooter className="flex gap-2">
              <SubmitButton
                isSubmitting={submitting}
                className="bg-picton-blue-400 hover:bg-picton-blue-500 dark:text-foreground w-full"
              >
                {submitting ? "Generating" : "Generate Payslip"}
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddSalaryDialog;
