import { AttendanceStatus } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { randomBytes } from "crypto";
import { twMerge } from "tailwind-merge";
import { differenceInMinutes, format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import toast from "react-hot-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeWord(word: string): string {
  if (!word || word !== word.toUpperCase()) return word;

  const lower = word.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

// Convert currency into Rupiah (can be adjusted to other currency)
export const convertRupiah = (amount: number) => {
  const formatter = Intl.NumberFormat("id-ID", {
    currency: "IDR",
    style: "currency",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return formatter;
};

// Format Date to a format like ("2024-04-25" to "25 Apr 2025")
export const formatDate = (date: Date) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return formattedDate;
};

export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }

  return age;
}

export const handleCopyClick = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!", {
      id: "clipboard",
    });
  } catch (error) {
    console.log(error);
  }
};

export function convertToGmt7TimeString(date: Date): string {
  const inputDate = new Date(date);
  const gmt7TimeZone = "Asia/Jakarta";
  const zonedDate = toZonedTime(inputDate, gmt7TimeZone);
  return format(zonedDate, "HH:mm");
}

export function getDurationCompact(
  start: string | Date,
  end: string | Date,
): string {
  const startDate =
    typeof start === "string" ? parseISO(start.replace(" ", "T")) : start;
  const endDate =
    typeof end === "string" ? parseISO(end.replace(" ", "T")) : end;

  const diffInMinutes = differenceInMinutes(endDate, startDate);
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;

  let result = "";
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0 || hours === 0) result += `${minutes}m`;

  return result.trim();
}

// Format how many days ago from a date
export const formatDaysAgo = (date: Date) => {
  let daysAgo;
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  // Calculate the difference in time (in milliseconds)
  const timeDifference = today.getTime() - date.getTime();

  // Convert milliseconds to days
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  switch (daysDifference) {
    case 0:
      daysAgo = "Today";
      break;
    case 1:
      daysAgo = "Yesterday";
      break;
    default:
      daysAgo = daysDifference + " Days Ago";
  }

  return daysAgo;
};

export const generateRandomString = (length: number = 16) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let result = "";

  const randomBuffer = randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += characters[randomBuffer[i] % charactersLength];
  }

  return result;
};

export function getAttendanceBadgeStyle(status: AttendanceStatus) {
  let badgeStyle = "";

  switch (status) {
    case "PRESENT":
      badgeStyle =
        "bg-green-400/30 text-green-600 border border-green-600 dark:bg-green-600/30 dark:text-green-400 dark:border-green-500";
      break;
    case "ABSENT":
      badgeStyle =
        "bg-red-400/30 text-red-600 border border-red-600 dark:bg-red-600/30 dark:text-red-400 dark:border-red-500";
      break;
    case "ON_LEAVE":
      badgeStyle =
        "bg-yellow-400/30 text-yellow-600 border border-yellow-600 dark:bg-yellow-600/30 dark:text-yellow-400 dark:border-yellow-500";
      break;
    case "LATE":
      badgeStyle =
        "bg-orange-400/30 text-orange-600 border border-orange-600 dark:bg-orange-600/30 dark:text-orange-400 dark:border-orange-500";
      break;
    default:
      // Default style
      badgeStyle =
        "bg-gray-400/30 text-gray-600 border border-gray-600 dark:bg-gray-600/30 dark:text-gray-300 dark:border-gray-500";
      break;
  }

  return badgeStyle;
}

export function getTotalHours(
  checkInTime: Date | string,
  checkOutTime: Date | string,
) {
  const dateCheckIn = new Date(checkInTime);
  const dateCheckOut = new Date(checkOutTime);

  // Calculate the difference in milliseconds.
  const differenceInMilliseconds =
    dateCheckOut.getTime() - dateCheckIn.getTime();

  // Convert milliseconds to hours.
  const hours = differenceInMilliseconds / (1000 * 60 * 60);

  return hours;
}

export function combineDateAndTime(
  date: Date,
  time?: string | null,
): Date | null {
  if (!time) return null;
  const [hours, minutes] = time.split(":").map(Number);
  const fullDate = new Date(date);
  fullDate.setHours(hours, minutes, 0, 0);
  return fullDate;
}

export function formatToTimeString(date?: Date | null): string {
  if (!date) return "";
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}
