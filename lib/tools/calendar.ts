import "server-only";
import { tool as createTool, generateObject } from "ai";
import type { OAuth2Client } from "google-auth-library";

import {
  AskForConfirmationSchema,
  CreateCalendarEventSchema,
  DeleteCalendarEventSchema,
  GetEventsSchema,
  GetEventsWithCategoriesSchema,
  TimeDistributionByCategorySchema,
  TimeDistributionPerDaySchema,
  UpdateCalendarEventSchema,
} from "./schemas";
import {
  createCalendarEvent,
  deleteCalendarEvents,
  getCalendarEvents,
  updateCalendarEvent,
} from "../api/google/calendar";
import { openai } from "@ai-sdk/openai";
import { timeDifferenceInHours } from "../utils";
import { createCalendarClient, createPeopleClient } from "../calendar";

export const getCalendarEventsTool = (oauth2Client: OAuth2Client) =>
  createTool({
    description: "Get events from user calendar",
    parameters: GetEventsSchema,
    execute: (args) =>
      getCalendarEvents(createCalendarClient(oauth2Client), args),
  });

export const getCalendarEventsWithCategoriesTool = (
  oauth2Client: OAuth2Client
) =>
  createTool({
    description: "Get events from user calendar with categories.",
    parameters: GetEventsSchema,
    execute: async (args, { messages }) => {
      console.log("EXECUTING GET EVENTS WITH CATEGORIES TOOL");
      const calendar = createCalendarClient(oauth2Client);
      const events = await getCalendarEvents(calendar, args);
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

      return Object.entries(timeSpentOnEachCategory).map(
        ([category, time]) => ({
          category,
          time,
        })
      );
    },
  });

export const visualizeTimeSpentOnCategoriesTool = () =>
  createTool({
    description:
      "Visualize/show time spent on meetings/events per category. getCalendarEventsWithCategoriesTool provides the necessary data",
    parameters: TimeDistributionByCategorySchema,
  });

export const getCalendarEventsPerDayDistributionTool = (
  oauth2Client: OAuth2Client
) =>
  createTool({
    description: "Get events' counts per day of week",
    parameters: GetEventsSchema,
    execute: async (args) => {
      const calendar = createCalendarClient(oauth2Client);
      const events = await getCalendarEvents(calendar, args);
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

export const visualizeBusiestDays = () =>
  createTool({
    description:
      "Visualize/show number of events per day of week. Get data from getCalendarEventsPerDayDistributionTool",
    parameters: TimeDistributionPerDaySchema,
  });

export const createCalendarEventTool = (oauth2Client: OAuth2Client) =>
  createTool({
    description:
      "Create a new event. Suggest time when not provided. ALWAYS check calendar for time conflict before creating. ALWAYS ask for confirmation using the askForConfirmationTool tool",
    parameters: CreateCalendarEventSchema,
    execute: (args) =>
      createCalendarEvent(
        createCalendarClient(oauth2Client),
        createPeopleClient(oauth2Client),
        args
      ),
  });

export const updateCalendarEventTool = (oauth2Client: OAuth2Client) =>
  createTool({
    description:
      "Update an existing event. Ask user for confirmation when details like time, etc are not explicitly mentioned.",
    parameters: UpdateCalendarEventSchema,
    execute: (args) =>
      updateCalendarEvent(createCalendarClient(oauth2Client), args),
  });

export const deleteCalendarEventTool = (oauth2Client: OAuth2Client) =>
  createTool({
    description:
      "Delete events. Ask for confirmation when deleting multiple events or when event to delete is ambiguous",
    parameters: DeleteCalendarEventSchema,
    execute: (args) =>
      deleteCalendarEvents(createCalendarClient(oauth2Client), args),
  });

export const askForConfirmationTool = () =>
  createTool({
    description:
      "Ask the user for confirmation to create/update/delete a certain event whose details are not super clear.",
    parameters: AskForConfirmationSchema,
  });
