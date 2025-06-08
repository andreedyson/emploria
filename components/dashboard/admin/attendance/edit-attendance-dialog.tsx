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
import { Input } from "@/components/ui/input";
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
import { BASE_URL } from "@/constants";
import { useEmployee } from "@/hooks/use-employee";
import { cn, combineDateAndTime, formatToTimeString } from "@/lib/utils";
import { AttendanceColumnsProps } from "@/types/admin/attendance";
import { attendanceSchema } from "@/validations/admin";
import { CalendarIcon, Loader, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

type EditAttendanceDialogProps = {
  attendanceData: AttendanceColumnsProps;
  companyId: string;
};

function EditAttendanceDialog({
  attendanceData,
  companyId,
}: EditAttendanceDialogProps) {
  const { data: employees } = useEmployee(companyId);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof attendanceSchema>>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      employeeId: attendanceData.employee.id,
      date: attendanceData.date,
      status: attendanceData.status,
      checkIn: formatToTimeString(attendanceData.checkIn),
      checkOut: formatToTimeString(attendanceData.checkOut),
    },
  });

  const status = form.watch("status");
  const disableTimeFields = status === "ABSENT" || status === "ON_LEAVE";

  useEffect(() => {
    if (disableTimeFields) {
      form.setValue("checkIn", "");
      form.setValue("checkOut", "");
    }
  }, [disableTimeFields, form]);

  useEffect(() => {
    if (open) {
      form.reset({
        employeeId: attendanceData.employee.id,
        date: attendanceData.date,
        status: attendanceData.status,
        checkIn: formatToTimeString(attendanceData.checkIn),
        checkOut: formatToTimeString(attendanceData.checkOut),
      });
    }
  }, [open, form, attendanceData]);

  async function onSubmit(values: z.infer<typeof attendanceSchema>) {
    setSubmitting(true);

    try {
      const checkIn = values.checkIn
        ? combineDateAndTime(values.date, values.checkIn)
        : null;
      const checkOut = values.checkOut
        ? combineDateAndTime(values.date, values.checkOut)
        : null;

      const res = await fetch(`${BASE_URL}/api/admin/attendance`, {
        method: "PUT",
        body: JSON.stringify({
          attendanceId: attendanceData.id,
          employeeId: values.employeeId,
          date: values.date,
          checkIn: checkIn,
          checkOut: checkOut,
          status: values.status,
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
      <DialogContent className="max-w-[350px] rounded-md sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Update Attendance</DialogTitle>
          <DialogDescription>
            Edit an existing employee attendance data.
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
                    disabled
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

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
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
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="checkIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check In</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        autoComplete="off"
                        {...field}
                        disabled={disableTimeFields}
                        value={disableTimeFields ? "" : (field.value ?? "")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="checkOut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check Out</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        autoComplete="off"
                        {...field}
                        disabled={disableTimeFields}
                        value={disableTimeFields ? "" : (field.value ?? "")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      <SelectItem value="PRESENT" className="text-green-500">
                        Present
                      </SelectItem>
                      <SelectItem value="ABSENT" className="text-red-500">
                        Absent
                      </SelectItem>
                      <SelectItem value="LATE" className="text-orange-500">
                        Late
                      </SelectItem>
                      <SelectItem value="ON_LEAVE" className="text-yellow-500">
                        On Leave
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex gap-2">
              <SubmitButton
                isSubmitting={submitting}
                className="dark:text-foreground w-full bg-yellow-400 hover:bg-yellow-500"
              >
                {submitting ? "Editing" : "Edit Attendance"}
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditAttendanceDialog;
