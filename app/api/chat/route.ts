import {
  getGoogleCredentials,
  updateGoogleCredentials,
} from "@/lib/api/supabase/google-credentials";
import { saveUserPreference } from "@/lib/api/supabase/preferences";
import { createOAuth2Client } from "@/lib/calendar";
import { createClient } from "@/lib/supabase/server";
import {
  askForConfirmationTool,
  createCalendarEventTool,
  deleteCalendarEventTool,
  getCalendarEventsPerDayDistributionTool,
  getCalendarEventsTool,
  getCalendarEventsWithCategoriesTool,
  updateCalendarEventTool,
  visualizeBusiestDays,
  visualizeTimeSpentOnCategoriesTool,
} from "@/lib/tools/calendar";
import { openai } from "@ai-sdk/openai";
import {
  generateText,
  InvalidToolArgumentsError,
  NoSuchToolError,
  streamText,
  ToolExecutionError,
} from "ai";

// export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, preferences } = await req.json();
  console.log("PREVIOUS PREFERENCES", preferences);
  const currentDateTime = new Date();
  const systemPrompt = `You are a very friendly personal assistant for a busy executive with expertise in managing calendar events.
   - Today is ${currentDateTime.toDateString()}
   - Current time is ${currentDateTime.toTimeString()}.
  Carefully resolve the relative time and date for querying the calendar events. When details like time are not explicitly mentioned, try to suggest the most appropriate time based on their preferences.
  ${
    preferences?.length > 0
      ? `User preferences: ${preferences
          .map(({ preference }: { preference: string }) => preference)
          .join(", ")}`
      : ""
  }
  `;
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User authentication failed");
  }
  const googleCredentials = await getGoogleCredentials(user.id);
  if (!googleCredentials) {
    throw new Error("User has not connected their calendar");
  }

  const oauth2Client = createOAuth2Client();
  oauth2Client.on("tokens", async (tokens) => {
    console.log("Updated Tokens", { tokens });
    if (tokens.access_token || tokens.refresh_token || tokens.expiry_date) {
      await updateGoogleCredentials(user.id, {
        access_token: tokens.access_token || undefined,
        refresh_token: tokens.refresh_token || undefined,
        expiry_date: tokens.expiry_date || undefined,
      });
    }
  });
  oauth2Client.setCredentials({
    refresh_token: googleCredentials.refresh_token,
    access_token: googleCredentials.access_token,
    expiry_date: googleCredentials.expiry_date,
  });

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    messages,
    tools: {
      getCalendarEventsTool: getCalendarEventsTool(oauth2Client),
      getCalendarEventsWithCategoriesTool:
        getCalendarEventsWithCategoriesTool(oauth2Client),
      visualizeTimeSpentOnCategoriesTool: visualizeTimeSpentOnCategoriesTool(),
      getCalendarEventsPerDayDistributionTool:
        getCalendarEventsPerDayDistributionTool(oauth2Client),
      visualizeBusiestDays: visualizeBusiestDays(),
      createCalendarEventTool: createCalendarEventTool(oauth2Client),
      updateCalendarEventTool: updateCalendarEventTool(oauth2Client),
      deleteCalendarEventTool: deleteCalendarEventTool(oauth2Client),
      askForConfirmationTool: askForConfirmationTool(),
    },
    async onFinish() {
      const response = await generateText({
        model: openai("gpt-4o-mini"),
        system: `You are expert in extracting user preferences from their messages. If no preferences are found, respond with 'none'. Response with 'none' if preference is already known.
        Example: 
          1) User: I prefer to have meetings in the afternoon.
            System: Prefers to have meetings in the afternoon.
          2) Let's schedule it for next week.
            System: none
        ${
          preferences.length > 0
            ? `Existing preferences: ${preferences
                .map(({ preference }: { preference: string }) => preference)
                .join(", ")}
        `
            : ""
        }`,
        messages,
      });
      console.log({ text: response.text });
      if (!response.text.toLowerCase().includes("none")) {
        saveUserPreference(user.id, response.text);
      }
    },
    maxSteps: 3,
  });

  return result.toDataStreamResponse({
    getErrorMessage(error) {
      console.log({ error });
      if (NoSuchToolError.isInstance(error)) {
        return "The model tried to call a unknown tool.";
      } else if (InvalidToolArgumentsError.isInstance(error)) {
        return "The model called a tool with invalid arguments.";
      } else if (ToolExecutionError.isInstance(error)) {
        return "An error occurred during tool execution.";
      } else {
        return "An unknown error occurred.";
      }
    },
  });
}
