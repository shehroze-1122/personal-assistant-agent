import { GaxiosError } from "googleapis-common";

export const withCalendarToolsErrorHandling = <T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T> | T
) => {
  return async (...args: Args): Promise<T | { error: string }> => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error("Error executing calendar tool", { error });
      if (error instanceof GaxiosError) {
        return { error: error.error?.message || "An error occurred" };
      } else if (error instanceof Error) {
        return { error: error.message };
      } else {
        return { error: "An error occurred" };
      }
    }
  };
};
