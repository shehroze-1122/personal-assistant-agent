import "server-only";
import { GaxiosError } from "googleapis-common";
import { calendar_v3, people_v1 } from "googleapis";
import {
  CreateCalendarEvent,
  DeleteCalendarEvent,
  GetEventsInput,
  UpdateCalendarEvent,
} from "../../tools/schemas";
import { isEmail } from "@/lib/utils";
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
      if (isEmail(attendee)) {
        return { email: attendee };
      }
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

  try {
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
  } catch (error) {
    console.log("Error creating event:", { error });
    if (error instanceof GaxiosError) {
      return error.error;
    } else if (error instanceof Error) {
      return error.message;
    } else {
      return error;
    }
  }
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

  try {
    const response = await calendar.events.patch({
      calendarId: "primary",
      eventId: eventId,
      requestBody: updatedEvent,
    });

    return response.data;
  } catch (error) {
    console.log("Error updating event", { error });
    if (error instanceof GaxiosError) {
      return error.error;
    } else if (error instanceof Error) {
      return error.message;
    } else {
      return error;
    }
  }
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
