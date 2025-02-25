import { getUserPreferences } from "@/lib/api/supabase/preferences";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("User authentication failed");
  }

  const preferences = await getUserPreferences(user.id);
  return NextResponse.json({
    preferences: (preferences || []).map((preference) => ({
      id: preference.id,
      preference: preference.preference,
    })),
  });
}
