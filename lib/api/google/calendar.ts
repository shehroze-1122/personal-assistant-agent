import "server-only";
import { calendar_v3, people_v1 } from "googleapis";
import { timeDifferenceInHours } from "@/lib/utils";
import { generateEventsCategories } from "@/lib/llm/objects";
import {
  CreateCalendarEvent,
  DeleteCalendarEvent,
  GetEventsInput,
  UpdateCalendarEvent,
} from "../../tools/schemas";
import { getContactEmailAddress } from "./people";

export const getCalendarEvents = async (
  calendar: calendar_v3.Calendar,
  props: GetEventsInput
) => {
  const response = await calendar.events.list({
    calendarId: "primary",
    maxResults: 2500,
    singleEvents: true,
    ...props,
  });
  return (
    response.data.items?.map((event) => ({
      id: event.id,
      creator: event.creator,
      created: event.created,
      summary: event.summary,
      description: event.description,
      eventType: event.eventType,
      start: event.start,
      end: event.end,
      location: event.location,
      atttendees: event.attendees,
      status: event.status,
      htmlLink: event.htmlLink,
    })) || []
  );
};

export const getAttendees = async (
  peopleClient: people_v1.People,
  attendees: string[]
): Promise<{ email: string }[]> => {
  try {
    const attendeesPromises = attendees.map(async (attendee) => {
      const contactEmailAddress = await getContactEmailAddress(
        peopleClient,
        attendee
      );
      if (contactEmailAddress) return { email: contactEmailAddress };
      return null;
    });
    const resolvedAttendees = await Promise.allSettled(attendeesPromises);
    const validAttendees = resolvedAttendees.filter(
      (attendee) => attendee.status === "fulfilled" && attendee.value
    );
    return validAttendees.map(
      (attendee) =>
        (attendee as PromiseFulfilledResult<{ email: string }>).value
    );
  } catch (error) {
    console.error("Error getting attendees", { error });
    return [];
  }
};

export const createCalendarEvent = async (
  calendar: calendar_v3.Calendar,
  peopleClient: people_v1.People,
  props: CreateCalendarEvent
) => {
  const {
    summary,
    location,
    description,
    startTime,
    endTime,
    attendees,
    eventType,
    recurrence,
  } = props;

  const event = {
    summary,
    location,
    description,
    start: startTime
      ? {
          dateTime: startTime,
          timeZone: "Europe/Berlin",
        }
      : undefined,
    end: endTime
      ? {
          dateTime: endTime,
          timeZone: "Europe/Berlin",
        }
      : undefined,
    attendees:
      attendees && attendees.length > 0
        ? await getAttendees(peopleClient, attendees)
        : undefined,
    eventType,
    recurrence,
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: event,
  });
  const data = response.data;
  return {
    creator: data.creator,
    created: data.created,
    summary: data.summary,
    description: data.description,
    eventType: data.eventType,
    start: data.start,
    end: data.end,
    location: data.location,
    atttendees: data.attendees,
    status: data.status,
    htmlLink: data.htmlLink,
  };
};

export const updateCalendarEvent = async (
  calendar: calendar_v3.Calendar,
  args: UpdateCalendarEvent
) => {
  const { eventId, updates } = args;
  const { startTime, endTime, ...otherUpdates } = updates;

  const updatedEvent = {
    ...otherUpdates,
    start: startTime
      ? {
          dateTime: startTime,
          timeZone: "Europe/Berlin",
        }
      : undefined,
    end: endTime
      ? {
          dateTime: endTime,
          timeZone: "Europe/Berlin",
        }
      : undefined,
  };

  const response = await calendar.events.patch({
    calendarId: "primary",
    eventId: eventId,
    requestBody: updatedEvent,
  });

  return response.data;
};

export const deleteCalendarEvents = async (
  calendar: calendar_v3.Calendar,
  args: DeleteCalendarEvent
) => {
  const deletePromises = args.eventsToDelete.map((event) =>
    calendar.events.delete({
      calendarId: "primary",
      eventId: event.eventId,
      sendUpdates: "all",
      ...(event.deleteSeries && { recurrenceId: event.eventId }),
    })
  );

  const results = await Promise.allSettled(deletePromises);

  return results.map((result) => ({
    status: result.status,
    data: result.status === "fulfilled" ? result.value.data : undefined,
    error: result.status === "rejected" ? result.reason : undefined,
  }));
};

export const getCalendarEventsPerDayDistribution = async (
  calendar: calendar_v3.Calendar,
  args: GetEventsInput
) => {
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
};

export const getCalendarEventsPerCategory = async (
  calendar: calendar_v3.Calendar,
  args: GetEventsInput
) => {
  const events = await getCalendarEvents(calendar, args);

  const eventsWithCategories = await generateEventsCategories(
    events
      .filter((event) => event.summary)
      .map((event) => ({ summary: event.summary! }))
  );
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
};
