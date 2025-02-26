"use server";
import { createOAuth2Client } from "@/lib/calendar";
import { redirect } from "next/navigation";
import { deleteGoogleCredentials } from "../api/supabase/google-credentials";

export const connectGoogleCalendar = async () => {
  const oauth2Client = createOAuth2Client();
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/calendar.events",
      "https://www.googleapis.com/auth/contacts.readonly",
    ],
    prompt: "consent",
  });

  redirect(authUrl);
};

export const disconnectGoogleCalendar = async (userId: string) => {
  return deleteGoogleCredentials(userId);
};
