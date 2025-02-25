import { createGoogleCredentials } from "@/lib/api/supabase/google-credentials";
import { NextRequest, NextResponse } from "next/server";
import { createOAuth2Client } from "@/lib/calendar";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Code not found in query parameters" },
      { status: 400 }
    );
  }

  try {
    const oauth2Client = createOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    try {
      await createGoogleCredentials(tokens);
    } catch (error) {
      console.error("Error saving token:", error);
      return NextResponse.json(
        { error: "Failed to save token" },
        { status: 500 }
      );
    }
    return NextResponse.redirect(
      new URL("/agent", process.env.NEXT_PUBLIC_BASE_URL)
    );
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    return NextResponse.json(
      { error: "Failed to exchange code for tokens" },
      { status: 500 }
    );
  }
}
