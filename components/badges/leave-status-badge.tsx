import React from "react";
import { Badge } from "../ui/badge";
import { LeaveStatus } from "@prisma/client";

type LeaveStatusBadgeProps = {
  status: LeaveStatus;
};

function LeaveStatusBadge({ status }: LeaveStatusBadgeProps) {
  const badgeStyle =
    status === "PENDING"
      ? "text-orange-600 bg-orange-300/30 border-orange-400"
      : status === "APPROVED"
        ? "text-green-600 bg-green-300/30 border-green-400"
        : status === "REJECTED"
          ? "text-red-600 bg-red-300/30 border-red-400"
          : "text-gray-500 bg-gray-300/30 border-gray-400";
  return (
    <Badge className={`${badgeStyle} rounded-full border-2 px-3 font-semibold`}>
      {status.replace(/^([A-Z])([A-Z]*)$/, (match, firstLetter, restOfWord) => {
        return firstLetter + restOfWord.toLowerCase();
      })}
    </Badge>
  );
}

export default LeaveStatusBadge;
