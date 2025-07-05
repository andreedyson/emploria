import React from "react";
import { Badge } from "../ui/badge";
import { LeaveStatus } from "@prisma/client";
import { CheckCircle, CircleX, Loader, X } from "lucide-react";

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
          : status === "CANCELLED"
            ? "text-amber-600 bg-amber-300/30 border-amber-400"
            : "text-gray-500 bg-gray-300/30 border-gray-400";
  return (
    <Badge className={`${badgeStyle} rounded-full border font-semibold`}>
      {status === "PENDING" ? (
        <Loader size={12} strokeWidth={3} />
      ) : status === "APPROVED" ? (
        <CheckCircle size={12} strokeWidth={3} />
      ) : status === "REJECTED" ? (
        <CircleX size={12} strokeWidth={3} />
      ) : status === "CANCELLED" ? (
        <X size={12} strokeWidth={3} />
      ) : (
        ""
      )}
      {status.replace(/^([A-Z])([A-Z]*)$/, (match, firstLetter, restOfWord) => {
        return firstLetter + restOfWord.toLowerCase();
      })}
    </Badge>
  );
}

export default LeaveStatusBadge;
