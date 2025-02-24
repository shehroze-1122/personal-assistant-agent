"use server";
import { createOAuth2Client } from "@/lib/calendar";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { z } from "zod";
import { deleteGoogleCredentials } from "./api/supabase/google-credentials";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const login = async (_: unknown, formData: FormData) => {
  const supabase = await createClient();

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = loginSchema.safeParse(data);
  if (!result.data) {
    console.error(result.error);
    return {
      message: "Invalid input format",
    };
  }
  const { error } = await supabase.auth.signInWithPassword(result.data);

  if (error) {
    console.error(error.message);
    return {
      message: "Invalid credentials",
    };
  }

  revalidatePath("/", "layout");
  redirect("/agent");
};

export const connectGoogleCalendar = async () => {
  const oauth2Client = createOAuth2Client();
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.events"],
    prompt: "consent",
  });

  redirect(authUrl);
};

export const disconnectGoogleCalendar = async (userId: string) => {
  return deleteGoogleCredentials(userId);
};
