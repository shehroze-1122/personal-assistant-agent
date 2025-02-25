import { createClient } from "@/lib/supabase/server";

export const getUserPreferences = async (userId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("preferences")
    .select("*")
    .eq("user_id", userId);
  if (error && error.code !== "PGRST116") {
    throw new Error(`Error getting user preferences token: ${error.message}`);
  }
  return data;
};

export const saveUserPreference = async (
  userId: string,
  preference: string
) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from("preferences")
    .insert({ user_id: userId, preference: preference });
  if (error) {
    throw new Error(`Error saving user preferences: ${error.message}`);
  }
  return {
    success: true,
  };
};
