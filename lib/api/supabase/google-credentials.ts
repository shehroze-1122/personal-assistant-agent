import "server-only";
import { createClient } from "@/lib/supabase/server";
import { Credentials } from "google-auth-library";

export const createGoogleCredentials = async (
  credentials: Pick<
    Credentials,
    "access_token" | "expiry_date" | "refresh_token"
  >
) => {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User authentication failed");
  }

  const existingToken = await getGoogleCredentials(user.id);

  let response;

  const data = {
    access_token: credentials.access_token || undefined,
    expiry_date: credentials.expiry_date || undefined,
    refresh_token: credentials.refresh_token || undefined,
  };
  if (existingToken) {
    response = await supabase
      .from("google_credentials")
      .update(data)
      .eq("user_id", user.id);
  } else {
    response = await supabase
      .from("google_credentials")
      .insert({ user_id: user.id, ...data });
  }
  if (response.error) {
    throw new Error(`Error saving token: ${response.error.message}`);
  }

  return { success: true };
};

export const getGoogleCredentials = async (userId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("google_credentials")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(`Error checking existing token: ${error.message}`);
  }

  return data;
};

export const updateGoogleCredentials = async (
  userId: string,
  updates: Pick<Credentials, "access_token" | "expiry_date" | "refresh_token">
) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from("google_credentials")
    .update(updates)
    .eq("user_id", userId);
  if (error) {
    throw new Error(`Error updating token: ${error.message}`);
  }
  return { success: true };
};

export const deleteGoogleCredentials = async (userId: string) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from("google_credentials")
    .delete()
    .eq("user_id", userId);
  if (error) {
    throw new Error(`Error deleting token: ${error.message}`);
  }
  return { success: true };
};
