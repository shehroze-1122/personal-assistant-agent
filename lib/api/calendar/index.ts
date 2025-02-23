import { calendar } from "../../calendar";
import { GaxiosError } from "googleapis-common";
import { CreateCalendar, GetEventsInput } from "../../tools/schemas";
import "server-only";

export const getCalendarEvents = async (props: GetEventsInput) => {
  const response = await calendar.events.list({
    calendarId: "shehroze.exp@gmail.com",
    maxResults: 2500,
    singleEvents: true,
    ...props,
  });
  return (
    response.data.items?.map((event) => ({
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

export const createCalendarEvent = async (props: CreateCalendar) => {
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
    console.log({ error });
    if (error instanceof GaxiosError) {
      return error.error;
    } else if (error instanceof Error) {
      return error.message;
    } else {
      return error;
    }
  }
};
