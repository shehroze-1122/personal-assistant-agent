import { useEffect, useRef, RefObject } from "react";
import type { Message } from "ai";

export function useScrollToBottom<T extends HTMLElement>(
  messages: Message[]
): RefObject<T | null> {
  const endRef = useRef<T>(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return endRef;
}
