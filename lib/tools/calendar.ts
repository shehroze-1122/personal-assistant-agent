import "server-only";
import { tool as createTool, generateObject } from "ai";
import {
  CreateCalendarSchema,
  GetEventsSchema,
  GetEventsWithCategoriesSchema,
  TimeDistributionByCategorySchema,
  TimeDistributionPerDaySchema,
} from "./schemas";
import { createCalendarEvent, getCalendarEvents } from "../api/calendar";
import { openai } from "@ai-sdk/openai";
import { timeDifferenceInHours } from "../utils";

export const getCalendarEventsTool = createTool({
  description: "Get events from user calendar",
  parameters: GetEventsSchema,
  execute: (args) => getCalendarEvents(args),
});

export const getCalendarEventsWithCategoriesTool = createTool({
  description: "Get events from user calendar with categories.",
  parameters: GetEventsSchema,
  execute: async (args, { messages }) => {
    console.log("EXECUTING GET EVENTS WITH CATEGORIES TOOL");
    const events = await getCalendarEvents(args);
    const userPrompt = messages.at(-1)?.content;

    const { object: eventsWithCategories } = await generateObject({
      model: openai("gpt-4o-mini"),
      output: "array",
      schema: GetEventsWithCategoriesSchema,
      system:
        "You are an expert in cateogorizing events to enable efficient time management.",
      prompt: `
        ${userPrompt ? `User: ${userPrompt}` : ""}
        Categorize the following events:
        ${events.map((event) => `- ${event.summary}`).join("\n")}
      `,
    });
    const summaryToCategoryMap = Object.fromEntries(
      eventsWithCategories.map((event) => [event.summary, event.category])
    );
    const timeSpentOnEachCategory = events.reduce((acc, event) => {
      if (event.summary && event.start?.dateTime && event.end?.dateTime) {
        const category = summaryToCategoryMap[event.summary];
        acc[category] =
          (acc[category] || 0) +
          timeDifferenceInHours(event.start.dateTime, event.end.dateTime);
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(timeSpentOnEachCategory).map(([category, time]) => ({
      category,
      time,
    }));
  },
});

export const visualizeTimeSpentOnCategoriesTool = createTool({
  description:
    "Visualize time spent on each category. Call after getCalendarEventsWithCategoriesTool",
  parameters: TimeDistributionByCategorySchema,
});

export const getCalendarEventsPerDayDistributionTool = createTool({
  description: "Get events' counts per day of week",
  parameters: GetEventsSchema,
  execute: async (args) => {
    const events = await getCalendarEvents(args);
    const numberOfEventsPerDay = events.reduce((acc, event) => {
      if (event.start && (event.start?.dateTime || event.start?.date)) {
        const stringDate = event.start.dateTime || event.start.date;
        const date = new Date(stringDate!);
        const day = new Intl.DateTimeFormat("en-US", {
          weekday: "long",
          timeZone: event.start.timeZone || undefined,
        }).format(date);

        acc[day] = (acc[day] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(numberOfEventsPerDay).map(([day, count]) => ({
      day,
      count,
    }));
  },
});

export const visualizeBusiestDays = createTool({
  description:
    "Visualize the busiest days(Mon, Tue, etc.) by event count. Recieve data from getCalendarEventsPerDayDistributionTool",
  parameters: TimeDistributionPerDaySchema,
});

export const createCalendarEventTool = createTool({
  description:
    "Create a new event. Always check existing events for time conflict",
  parameters: CreateCalendarSchema,
  execute: (args) => createCalendarEvent(args),
});
