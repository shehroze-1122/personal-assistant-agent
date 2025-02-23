import "server-only";

import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "service-account.json",
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

// Get Google Calendar API
export const calendar = google.calendar({ version: "v3", auth });
