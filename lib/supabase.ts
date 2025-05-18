import { SUPABASE_KEY, SUPABASE_URL } from "@/constants";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = SUPABASE_URL as string;
const supabaseKey = SUPABASE_KEY as string;

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseClient = supabase.storage.from("emploria");

export const getImageUrl = (
  name: string,
  type: "users" | "companies" = "users",
) => {
  const { data } = supabase.storage
    .from("emploria")
    .getPublicUrl(`/public/${type}/${name}`);

  if (!name) {
    return "/assets/image-placeholder.svg";
  }

  return data.publicUrl;
};

export const uploadFile = async (
  file: File,
  path: "users" | "companies" = "users",
) => {
  const fileType = file.type.split("/")[1];
  const fileName = `${path}-${Date.now()}.${fileType}`;

  await supabaseClient.upload(`/public/${path}/${fileName}`, file, {
    cacheControl: "3600",
    upsert: false,
  });

  return fileName;
};

export const updateFile = async (
  prevFile: File,
  newFile: File,
  path: "users" | "companies" = "users",
) => {
  const fileType = newFile.type.split("/")[1];
  const newFilename = `${path}-${Date.now()}.${fileType}`;
  const newFilePath = `public/${path}/${newFilename}`;

  // Delete the old file if it exists
  if (prevFile.name) {
    await deleteFiles([prevFile.name]);
  }

  await supabaseClient.upload(newFilePath, newFile, {
    cacheControl: "3600",
    upsert: true,
  });

  return newFilename;
};

export const deleteFiles = async (
  fileNames: string[],
  path: "users" | "companies" = "users",
) => {
  const filePaths = fileNames.map((fileName) => `public/${path}/${fileName}`);

  await supabaseClient.remove(filePaths);
};
