import { getGoogleCredentials } from "@/lib/api/supabase/google-credentials";
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

  const credentials = await getGoogleCredentials(user.id);
  if (!credentials) {
    return NextResponse.json({
      connections: {
        google: false,
      },
    });
  }
  return NextResponse.json({
    connections: {
      google: true,
    },
  });
}
