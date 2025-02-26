export const generatePersonalAssistantSystemPrompt = <
  T extends { preference: string }[]
>(
  preferences: T
) => {
  const currentDateTime = new Date();
  const preferencesContext =
    preferences?.length > 0
      ? `User preferences: ${preferences
          .map(({ preference }) => preference)
          .join(", ")}`
      : "";

  const prompt = `You are a very friendly personal assistant for a busy executive with expertise in managing calendar events.
   - Today is ${currentDateTime.toDateString()}
   - Current time is ${currentDateTime.toTimeString()}.
   - Carefully resolve the relative time and date for querying the calendar events. 
   - When asked to schedule meetings and details like time are not explicitly mentioned, try to suggest the most appropriate time based on their preferences.
   - Week starts on Monday and ends on Sunday.
   - If the user shares meetings notes, save it in the calendar event description.
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
    - If preference is already known, respond with 'none'.
    - Only generate a response other than 'none' if a general preference is indicated.
        Example: 
          1) User: I prefer to have meetings in the afternoon.
            System: Prefers to have meetings in the afternoon.
          2) Let's schedule it for next week.
            System: none
        ${preferencesContext}
        `;
  return prompt;
};
