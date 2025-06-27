"use client";

import { customToast } from "@/components/custom-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BASE_URL } from "@/constants";
import { convertRupiah } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SettingType =
  | "lateAttendance"
  | "attendanceBonus"
  | "checkInStartTime"
  | "checkInEndTime"
  | "minimumWorkHours";

const labelMap: Record<SettingType, string> = {
  lateAttendance: "Late Attendance Penalty Rate",
  attendanceBonus: "Attendance Bonus Rate",
  checkInStartTime: "Check-In Start Time",
  checkInEndTime: "Check-In End Time",
  minimumWorkHours: "Minimum Work Hours (hrs)",
};

const fieldMap: Record<SettingType, string> = {
  lateAttendance: "lateAttendancePenaltyRate",
  attendanceBonus: "attendanceBonusRate",
  checkInStartTime: "checkInStartTime",
  checkInEndTime: "checkInEndTime",
  minimumWorkHours: "minimumWorkHours",
};

type CompanySettingInputProps = {
  type: SettingType;
  initialValue: number | string;
  companyId: string;
};

export function CompanySettingInput({
  type,
  initialValue,
  companyId,
}: CompanySettingInputProps) {
  const [value, setValue] = useState<string>(initialValue.toString());
  const [loading, setLoading] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const router = useRouter();

  const label = labelMap[type];
  const field = fieldMap[type];

  const handleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  async function handleSave() {
    setLoading(true);
    const res = await fetch(
      `${BASE_URL}/api/admin/company/${companyId}/settings`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [field]:
            type === "minimumWorkHours" ||
            type === "lateAttendance" ||
            type === "attendanceBonus"
              ? parseFloat(value)
              : value,
        }),
      },
    );

    setLoading(false);
    if (res.ok) {
      customToast("success", `${label} updated successfully`);
      setEditMode(false);
      router.refresh();
    } else {
      customToast("error", `Failed to update ${label}`);
    }
  }

  return (
    <>
      {editMode ? (
        <div className="space-y-2">
          <Label className="font-medium">{label}</Label>
          <Input
            id={label}
            name={label}
            type={type.includes("Time") ? "time" : "number"}
            min={type === "minimumWorkHours" ? 0 : undefined}
            step={type === "minimumWorkHours" ? 0.5 : "any"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <Button
            className="bg-picton-blue-600 cursor-pointer rounded px-4 py-2 text-white"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div onClick={handleEditMode} className="flex items-center gap-1">
            <Label className="cursor-pointer font-medium">{label}</Label>
            <Pencil size={12} />
          </div>
          <div className="bg-input text-muted-foreground w-full rounded border p-2">
            {type === "attendanceBonus" || type === "lateAttendance"
              ? convertRupiah(initialValue as number)
              : initialValue}
          </div>
        </div>
      )}
    </>
  );
}
