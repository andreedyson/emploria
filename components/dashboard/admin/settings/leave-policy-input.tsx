"use client";

import { customToast } from "@/components/custom-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { LeaveFrequency, LeaveType } from "@prisma/client";
import { Baby, Calendar, Pencil, Pill } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LeavePolicyInputProps = {
  companyId: string;
  policyId: string;
  type: LeaveType;
  frequency: LeaveFrequency;
  allowedDays: number;
};

function LeavePolicyInput({
  companyId,
  policyId,
  type,
  frequency,
  allowedDays,
}: LeavePolicyInputProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedFrequency, setEditedFrequency] =
    useState<LeaveFrequency>(frequency);
  const [editedDays, setEditedDays] = useState<number>(allowedDays);
  const router = useRouter();

  async function handleSave() {
    setLoading(true);
    const res = await fetch("/api/admin/company/leave-policies", {
      method: policyId ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: policyId,
        companyId,
        leaveType: type,
        frequency: editedFrequency,
        allowedDays: editedDays,
      }),
    });

    setLoading(false);
    if (res.ok) {
      customToast("success", `${type} Policy updated`);
      setEditMode(false);
      router.refresh();
    } else {
      customToast("error", `Failed to update ${type} policy`);
    }
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {type === "ANNUAL" ? (
            <Calendar size={16} />
          ) : type === "SICK" ? (
            <Pill size={16} />
          ) : type === "MATERNITY" ? (
            <Baby size={16} />
          ) : null}
          <CardTitle>{type}</CardTitle>
        </div>
        <Pencil
          size={20}
          color="#faba00"
          className="cursor-pointer"
          onClick={() => setEditMode(true)}
        />
      </CardHeader>
      <CardContent>
        <Separator className="mb-3" />
        {editMode ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label>Frequency</label>
              <Select
                value={editedFrequency}
                onValueChange={(val) =>
                  setEditedFrequency(val as LeaveFrequency)
                }
              >
                <SelectTrigger className="w-full max-w-[120px]">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <label>Allowed Days</label>
              <Input
                type="number"
                value={editedDays}
                onChange={(e) => setEditedDays(Number(e.target.value))}
                className="w-full max-w-[120px]"
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={loading}
                className="bg-picton-blue-600 cursor-pointer rounded px-3 py-1 text-white"
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground font-medium">Frequency</p>
              <p className="font-semibold">{frequency}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground font-medium">Allowed Days</p>
              <p className="font-semibold">{allowedDays} days</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default LeavePolicyInput;
