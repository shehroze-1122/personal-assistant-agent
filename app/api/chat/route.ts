import {
  getGoogleCredentials,
  updateGoogleCredentials,
} from "@/lib/api/supabase/google-credentials";
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
  InvalidToolArgumentsError,
  NoSuchToolError,
  streamText,
  ToolExecutionError,
} from "ai";

// export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const currentDateTime = new Date();
  const systemPrompt = `You are a very friendly personal assistant for a busy executive with expertise in managing calendar events.
   - Today is ${currentDateTime.toDateString()}
   - Current time is ${currentDateTime.toTimeString()}.
  Carefully resolve the relative time and date for querying the calendar events.`;
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

  console.log({ googleCredentials });
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
    onStepFinish({ text, toolCalls, toolResults }) {
      console.log({ text, toolCalls, toolResults });
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
