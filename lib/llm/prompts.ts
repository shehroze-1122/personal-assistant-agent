import { isALeapYear } from "../utils";

export const generatePersonalAssistantSystemPrompt = <
  T extends { preference: string }[]
>(
  preferences: T
) => {
  // change the date to Europe/Berlin timezone
  const currentDateString = new Date().toLocaleString("en-GB", {
    timeZone: "Europe/Berlin",
  });
  const currentDay = new Date().toLocaleString("en-GB", {
    timeZone: "Europe/Berlin",
    weekday: "long",
  });
  const currentYear = new Date().toLocaleString("en-GB", {
    timeZone: "Europe/Berlin",
    year: "numeric",
  });
  const isCurrentYearLeap = isALeapYear(parseInt(currentYear));
  const preferencesContext =
    preferences?.length > 0
      ? `User preferences: ${preferences
          .map(({ preference }) => preference)
          .join(", ")}`
      : "";

  const prompt = `You are a very cool personal assistant for a busy executive with expertise in managing calendar events.
   - Today is ${currentDay} 
   - It's ${currentDateString}
   - Current year is ${isCurrentYearLeap ? "a leap year" : "not a leap year"}
   - User time zone is Europe/Berlin(GMT+1)
   - You must think carefully to resolve the relative time and date for querying the calendar events. 
   - When asked to schedule meetings and details like time are not explicitly mentioned, try to suggest the most appropriate time based on their preferences.
   - Week starts on Monday and ends on Sunday.
   - A day starts at 00:00:00 and ends at 23:59:59.
   - If the user shares meetings notes, save it in the calendar event description.
   - All confirmations(where necessary) should be asked via the 'askForConfirmationTool'.
  -----
  ${preferencesContext}
  `;
  return prompt;
};

export const generatePreferenceExtractionSystemPrompt = <
  T extends { preference: string }[]
>(
  preferences: T
) => {
  const preferencesContext =
    preferences?.length > 0
      ? `Existing Preferences: ${preferences
          .map(({ preference }) => preference)
          .join(", ")}`
      : "";

  const prompt = `You are expert in extracting user's general preferences from their messages. 
    - If the user's message does not indicate a general preference, respond with 'none'. 
    - If preference is already known in existing preferences, respond with 'none'.
    - Only generate a response other than 'none' if a general preference is indicated.
        Example: 
          1) User: I prefer to have meetings in the afternoon.
            System: Prefers to have meetings in the afternoon.
          2) User: Let's schedule it for evening.
            System: none
          3) User: Do it in the morning.
            System: none
          4) User: I like to have 40 minutes meetings.
            System: Preferes to have 40 minutes meetings.
          5) Let's schedule it for next week.
            System: none
        ${preferencesContext}
        `;
  return prompt;
};
