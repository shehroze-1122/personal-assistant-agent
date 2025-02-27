import { generateObject } from "ai";
import { GetEventsWithCategoriesSchema } from "../tools/schemas";
import { openai } from "@ai-sdk/openai";

export const generateEventsCategories = async <T extends { summary: string }>(
  events: T[]
) => {
  const { object: eventsWithCategories } = await generateObject({
    model: openai("gpt-4o-mini"),
    output: "array",
    schema: GetEventsWithCategoriesSchema,
    system:
      "You are an expert in cateogorizing events to enable efficient time management.",
    prompt: `
        Categorize the following events:
        ${events.map((event) => `- ${event.summary}`).join("\n")}
      `,
  });
  return eventsWithCategories;
};
