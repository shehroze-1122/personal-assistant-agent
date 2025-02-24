import { GaxiosError } from "googleapis-common";
import {
  CreateCalendarEvent,
  DeleteCalendarEvent,
  GetEventsInput,
  UpdateCalendarEvent,
} from "../../tools/schemas";
import "server-only";
import { calendar_v3 } from "googleapis";

export const getCalendarEvents = async (
  calendar: calendar_v3.Calendar,
  props: GetEventsInput
) => {
  const response = await calendar.events.list({
    calendarId: "shehroze.exp@gmail.com",
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

export const createCalendarEvent = async (
  calendar: calendar_v3.Calendar,
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
    focusTimeProperties,
    outOfOfficeProperties,
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
    attendees: attendees?.map((attendee) => ({ email: attendee })),
    eventType,
    focusTimeProperties,
    outOfOfficeProperties,
    recurrence,
  };

  try {
    const response = await calendar.events.insert({
      calendarId: "shehroze.exp@gmail.com",
      requestBody: event,
    });
    const data = response.data;
    console.log({ data });
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
      calendarId: "shehroze.exp@gmail.com",
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
      calendarId: "shehroze.exp@gmail.com",
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
