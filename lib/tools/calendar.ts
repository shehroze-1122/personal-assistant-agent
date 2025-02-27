import "server-only";
import { tool as createTool } from "ai";
import type { OAuth2Client } from "google-auth-library";

import {
  AskForConfirmationSchema,
  CreateCalendarEventSchema,
  DeleteCalendarEventSchema,
  GetEventsSchema,
  TimeDistributionByCategorySchema,
  TimeDistributionPerDaySchema,
  UpdateCalendarEventSchema,
} from "./schemas";
import {
  createCalendarEvent,
  deleteCalendarEvents,
  getCalendarEvents,
  getCalendarEventsPerCategory,
  getCalendarEventsPerDayDistribution,
  updateCalendarEvent,
} from "../api/google/calendar";
import { withCalendarToolsErrorHandling } from "./utils";
import { createCalendarClient, createPeopleClient } from "../calendar";

export const getCalendarEventsTool = (oauth2Client: OAuth2Client) =>
  createTool({
    description: "Get events from user calendar",
    parameters: GetEventsSchema,
    execute: (args) =>
      withCalendarToolsErrorHandling(getCalendarEvents)(
        createCalendarClient(oauth2Client),
        args
      ),
  });

export const getCalendarEventsWithCategoriesTool = (
  oauth2Client: OAuth2Client
) =>
  createTool({
    description: "Get events from user calendar with categories.",
    parameters: GetEventsSchema,
    execute: async (args) =>
      withCalendarToolsErrorHandling(getCalendarEventsPerCategory)(
        createCalendarClient(oauth2Client),
        args
      ),
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
    execute: (args) =>
      withCalendarToolsErrorHandling(getCalendarEventsPerDayDistribution)(
        createCalendarClient(oauth2Client),
        args
      ),
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
      "Create a new event. ALWAYS check calendar for time conflict before creating. Ask for confirmation using the askForConfirmationTool tool when details like time, etc are not explicitly mentioned.",
    parameters: CreateCalendarEventSchema,
    execute: (args) =>
      withCalendarToolsErrorHandling(createCalendarEvent)(
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
      withCalendarToolsErrorHandling(updateCalendarEvent)(
        createCalendarClient(oauth2Client),
        args
      ),
  });

export const deleteCalendarEventTool = (oauth2Client: OAuth2Client) =>
  createTool({
    description:
      "Delete events. Ask for confirmation when deleting multiple events or when event to delete is ambiguous",
    parameters: DeleteCalendarEventSchema,
    execute: (args) =>
      withCalendarToolsErrorHandling(deleteCalendarEvents)(
        createCalendarClient(oauth2Client),
        args
      ),
  });

export const askForConfirmationTool = () =>
  createTool({
    description:
      "Ask the user for confirmation to create/update/delete a certain event whose details are not super clear.",
    parameters: AskForConfirmationSchema,
  });
