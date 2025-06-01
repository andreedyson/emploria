import { SalaryStatus } from "@prisma/client";
import React from "react";
import { Badge } from "../ui/badge";
import { CheckCircle, Loader } from "lucide-react";

type SalaryStatusBadgeProps = {
  status: SalaryStatus;
};

function SalaryStatusBadge({ status }: SalaryStatusBadgeProps) {
  const badgeStyle =
    status === "UNPAID"
      ? "bg-orange-300/40 text-orange-500 border-orange-500"
      : status === "PAID"
        ? "bg-green-300/40 text-green-500 border-green-500"
        : "bg-gray-300/40 text-gray-500 border-gray-500";
  return (
    <Badge className={`${badgeStyle} rounded-full border-2 px-3 font-semibold`}>
      {status === "UNPAID" ? (
        <Loader size={12} strokeWidth={3} />
      ) : status === "PAID" ? (
        <CheckCircle size={12} strokeWidth={3} />
      ) : (
        ""
      )}
      {status}
    </Badge>
  );
}

export default SalaryStatusBadge;
