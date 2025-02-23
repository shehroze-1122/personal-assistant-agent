"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { z } from "zod";

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
