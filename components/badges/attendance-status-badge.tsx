import { getAttendanceBadgeStyle } from "@/lib/utils";
import { AttendanceStatus } from "@prisma/client";
import React from "react";
import { Badge } from "../ui/badge";
import { CalendarX, CircleCheck, CircleX, Clock } from "lucide-react";

type AttendanceStatusBadgeProps = {
  status: AttendanceStatus;
};

function AttendanceStatusBadge({ status }: AttendanceStatusBadgeProps) {
  const attendanceText = status.split("_").join(" ");
  const badgeStyle = getAttendanceBadgeStyle(status);
  return (
    <Badge className={`${badgeStyle} rounded-full border font-semibold`}>
      {status === "ABSENT" ? (
        <CircleX size={12} strokeWidth={3} />
      ) : status === "ON_LEAVE" ? (
        <CalendarX size={12} strokeWidth={3} />
      ) : status === "LATE" ? (
        <Clock size={12} strokeWidth={3} />
      ) : status === "PRESENT" ? (
        <CircleCheck size={12} strokeWidth={3} />
      ) : (
        ""
      )}
      {attendanceText
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")}
    </Badge>
  );
}

export default AttendanceStatusBadge;
