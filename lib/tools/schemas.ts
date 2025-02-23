import { z } from "zod";

export const GetEventsSchema = z.object({
  q: z
    .string()
    .optional()
    .describe(
      "Free text search terms to find events that match these terms in the following fields: summary, description, location, attendee's displayName, attendee's email, organizer's displayName, organizer's email, workingLocationProperties.officeLocation.label, workingLocationProperties.customLocation.label."
    ),
  timeMax: z
    .string()
    .optional()
    .describe(
      "Upper bound (exclusive) for an event's start time to filter by. The default is not to filter by start time. Must be an RFC3339 timestamp with mandatory time zone offset."
    ),
  timeMin: z
    .string()
    .optional()
    .describe(
      "Lower bound (exclusive) for an event's end time to filter by. The default is not to filter by end time. Must be an RFC3339 timestamp with mandatory time zone offset."
    ),
  eventTypes: z
    .array(
      z.enum([
        "default",
        "outOfOffice",
        "focusTime",
        "workingLocation",
        "fromGmail",
      ])
    )
    .optional()
    .describe(
      "The event type to filter by. This can be a single value, or a list of up to 5 values. Only provide this value when user asks for the particular event type."
    ),
});

export type GetEventsInput = z.infer<typeof GetEventsSchema>;

export const GetEventsWithCategoriesSchema = z.object({
  summary: z.string().describe("Event Summary"),
  category: z.string().describe("Recognized category of event"),
});

export const TimeDistributionByCategorySchema = z.object({
  data: z.array(
    z.object({
      category: z.string().describe("Event category"),
      time: z.number().nonnegative().describe("Time in hours"),
    })
  ),
});

export type TimeDistributionByCategory = z.infer<
  typeof TimeDistributionByCategorySchema
>;

export const TimeDistributionPerDaySchema = z.object({
  data: z.array(
    z.object({
      day: z.enum([
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ]),
      count: z.number().int().gte(0).describe("Number of events"),
    })
  ),
});

export type TimeDistributionPerDay = z.infer<
  typeof TimeDistributionPerDaySchema
>;

export const CreateCalendarSchema = z.object({
  summary: z.string().describe("Title of the event."),
  location: z.string().optional().describe("Location of the event"),
  description: z.string().optional().describe("Description of the event"),
  startTime: z
    .string()
    .describe(
      "Start time of the event. Must be an RFC3339 timestamp with mandatory time zone offset."
    ),
  endTime: z
    .string()
    .describe(
      "End time of the event. Must be an RFC3339 timestamp with mandatory time zone offset."
    ),
  attendees: z
    .array(z.string().email())
    .optional()
    .describe("List of emails of attendees"),
  eventType: z
    .enum([
      "default",
      "outOfOffice",
      "focusTime",
      "workingLocation",
      "fromGmail",
    ])
    .default("default")
    .describe("Specific event type of event"),
  outOfOfficeProperties: z
    .object({
      autoDeclineMode: z
        .enum([
          "declineNone",
          "declineAllConflictingInvitations",
          "declineOnlyNewConflictingInvitations",
        ])
        .optional()
        .describe(
          "Whether to decline meeting invitations which overlap Out of office events"
        ),
      declineMessage: z
        .string()
        .optional()
        .describe(
          "Response message to set if an existing event or new invitation is automatically declined by Calendar."
        ),
    })
    .optional()
    .describe("Out of office event data. Used if eventType is outOfOffice."),
  focusTimeProperties: z
    .object({
      autoDeclineMode: z
        .enum([
          "declineNone",
          "declineAllConflictingInvitations",
          "declineOnlyNewConflictingInvitations",
        ])
        .optional()
        .describe(
          "Whether to decline meeting invitations which overlap focus time events"
        ),
      declineMessage: z
        .string()
        .optional()
        .describe(
          "Response message to set if an existing event or new invitation is automatically declined by Calendar."
        ),
    })
    .optional()
    .describe("Focus time event data. Used if eventType is focusTime."),
  recurrence: z
    .array(z.string())
    .optional()
    .describe(
      "List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event, as specified in RFC5545."
    ),
});

export type CreateCalendar = z.infer<typeof CreateCalendarSchema>;
