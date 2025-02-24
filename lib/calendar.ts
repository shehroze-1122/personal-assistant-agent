import "server-only";

import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

// const auth = new google.auth.GoogleAuth({
//   keyFile: "service-account.json",
//   scopes: ["https://www.googleapis.com/auth/calendar"],
// });

// // Get Google Calendar API
// export const calendar = google.calendar({ version: "v3", auth });

export const createOAuth2Client = () =>
  new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/googleauth/callback`
  );

export const createCalendarClient = (auth: OAuth2Client) =>
  google.calendar({ version: "v3", auth });
