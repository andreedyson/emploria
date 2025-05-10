"use server";

export async function getWelcomeMessage(name: string) {
  try {
    // Simulate async logic or replace with DB call
    return `Welcome, ${name}! 🚀`;
  } catch (error) {
    console.error("Server Action Error:", error);
    return "Something went wrong.";
  }
}
