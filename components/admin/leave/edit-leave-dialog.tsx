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
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { customToast } from "@/components/custom-toast";
import { SubmitButton } from "@/components/submit-button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BASE_URL } from "@/constants";
import { useEmployee } from "@/hooks/use-employee";
import { cn } from "@/lib/utils";
import { leaveSchema } from "@/validations/admin";
import { CalendarX, Layers, Loader, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { LeaveColumnProps } from "@/types/admin/leave";

type EditLeaveDialogProps = {
  companyId: string;
  leaveData: LeaveColumnProps;
};

function EditLeaveDialog({ companyId, leaveData }: EditLeaveDialogProps) {
  const { data: employees } = useEmployee(companyId);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof leaveSchema>>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      employeeId: leaveData.employee.id,
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      status: leaveData.status,
      leaveType: leaveData.leaveType,
      reason: leaveData.reason,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        employeeId: leaveData.employee.id,
        startDate: leaveData.startDate,
        endDate: leaveData.endDate,
        status: leaveData.status,
        leaveType: leaveData.leaveType,
        reason: leaveData.reason,
      });
    }
  }, [open, form, leaveData]);

  async function onSubmit(values: z.infer<typeof leaveSchema>) {
    setSubmitting(true);

    try {
      const res = await fetch(`${BASE_URL}/api/admin/leave`, {
        method: "PUT",
        body: JSON.stringify({
          leaveId: leaveData.id,
          employeeId: values.employeeId,
          startDate: values.startDate,
          endDate: values.endDate,
          status: values.status,
          leaveType: values.leaveType,
          reason: values.reason,
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
          size={"icon"}
          className="flex cursor-pointer items-center gap-2 bg-yellow-500 text-white duration-200 hover:bg-yellow-600"
        >
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[350px] rounded-md sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Leave</DialogTitle>
          <DialogDescription>
            Edit an existing employee leave data.
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
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarX className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="pointer-events-auto w-auto p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarX className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="pointer-events-auto w-auto p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea rows={10} autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                  <p className="text-muted-foreground text-sm">
                    Max. 250 characters
                  </p>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="leaveType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Layers size={14} />
                      Leave Type
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Leave Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SICK">Sick</SelectItem>
                        <SelectItem value="ANNUAL">Annual</SelectItem>
                        <SelectItem value="UNPAID">Unpaid</SelectItem>
                        <SelectItem value="MATERNITY">Maternity</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Loader size={14} />
                      Status
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDING" className="text-orange-500">
                          Pending
                        </SelectItem>
                        <SelectItem value="REJECTED" className="text-red-500">
                          Rejected
                        </SelectItem>
                        <SelectItem value="APPROVED" className="text-green-500">
                          Approved
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex gap-2">
              <SubmitButton
                isSubmitting={submitting}
                className="dark:text-foreground w-full bg-yellow-400 hover:bg-yellow-500"
              >
                {submitting ? "Editing" : "Edit Leave"}
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditLeaveDialog;
