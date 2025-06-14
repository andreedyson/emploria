// DO NOT REMOVE (used for API routes and other baseUrl related stuff)
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const ALLOWED_FILE_TYPE = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/webp",
];
export const months = [
  { label: "January", value: "01" },
  { label: "February", value: "02" },
  { label: "March", value: "03" },
  { label: "April", value: "04" },
  { label: "May", value: "05" },
  { label: "June", value: "06" },
  { label: "July", value: "07" },
  { label: "August", value: "08" },
  { label: "September", value: "09" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

export const LEAVE_TYPE = ["ANNUAL", "SICK", "UNPAID", "MATERNITY"];
