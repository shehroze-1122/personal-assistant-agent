import "server-only";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

export const createOAuth2Client = () =>
  new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/googleauth/callback`
  );

export const createCalendarClient = (auth: OAuth2Client) =>
  google.calendar({ version: "v3", auth });

export const createPeopleClient = (auth: OAuth2Client) =>
  google.people({ version: "v1", auth });
