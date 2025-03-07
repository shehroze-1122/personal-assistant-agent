import { SupabaseClient } from "@supabase/supabase-js";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const timeDifferenceInHours = (start: string, end: string) => {
  const diff = new Date(end).getTime() - new Date(start).getTime();
  return diff / (1000 * 60 * 60);
};

export const generateColors = (count: number) => {
  const hueStep = 360 / count;
  return Array.from({ length: count }, (_, i) => {
    const hue = i * hueStep;

    // Randomize saturation and lightness for more variation
    const saturation = Math.random() * 20 + 60; // Range from 60% to 80%
    const lightness = Math.random() * 20 + 50; // Range from 50% to 70%

    return {
      background: `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`, // Slightly higher opacity for better visibility
      border: `hsla(${hue}, ${saturation}%, ${lightness - 10}%, 1)`, // Darker border for contrast
    };
  });
};

export const mergeClasses = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getUser = async (supabase: SupabaseClient) => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }
  return data.user;
};

export const suggestions = [
  "What's on my plate for tomorrow?",
  "How did my distribution of time per category look like last week?",
  "Please clear my schedule for next Friday",
  "Schedule a meeting with Janet on Friday to review designs for Engaiagent",
];

export const isEmail = (value: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(value);
};

export const isALeapYear = (year: number) =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
