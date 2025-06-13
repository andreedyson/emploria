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

type SettingType = "lateAttendance" | "attendanceBonus";

const labelMap: Record<SettingType, string> = {
  lateAttendance: "Late Attendance Penalty Rate",
  attendanceBonus: "Attendance Bonus Rate",
};

const fieldMap: Record<SettingType, string> = {
  lateAttendance: "lateAttendancePenaltyRate",
  attendanceBonus: "attendanceBonusRate",
};

type CompanySettingInputProps = {
  type: SettingType;
  initialValue: number;
  companyId: string;
};

export function CompanySettingInput({
  type,
  initialValue,
  companyId,
}: CompanySettingInputProps) {
  const [value, setValue] = useState<string | number>(initialValue.toString());
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
          [field]: parseFloat(value as string),
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
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Label className="font-medium">{label}</Label>
            <Pencil size={12} onClick={handleEditMode} />
          </div>
          <div className="bg-muted text-muted-foreground w-full rounded border p-2">
            {convertRupiah(initialValue)}
          </div>
        </div>
      )}
    </>
  );
}
