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

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    messages,
    tools: {
      getCalendarEventsTool,
      getCalendarEventsWithCategoriesTool,
      visualizeTimeSpentOnCategoriesTool,
      getCalendarEventsPerDayDistributionTool,
      visualizeBusiestDays,
      createCalendarEventTool,
      updateCalendarEventTool,
      deleteCalendarEventTool,
      askForConfirmationTool,
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
