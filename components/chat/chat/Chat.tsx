"use client";

import React from "react";
import { useScrollToBottom } from "@/hooks/useScrollToBottom";
import { useChat } from "@ai-sdk/react";
import { RefreshCcw, SendHorizontal } from "lucide-react";
import { generateId } from "ai";
import { useQueryClient } from "@tanstack/react-query";
import Preferences from "@/components/preferences";
import { suggestions } from "@/lib/utils";
import Suggestions from "../suggestions";
import ChatHeader from "../ChatHeader";
import IconButton from "@/components/common/IconButton";
import AILoader from "../AILoader";
import AIError from "../AIError";
import Message from "./Message";

function Chat() {
  const queryClient = useQueryClient();

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    addToolResult,
    setMessages,
    setInput,
    append,
    error,
    reload,
  } = useChat({
    onToolCall({ toolCall }) {
      if (toolCall.toolName === "visualizeTimeSpentOnCategoriesTool") {
        return toolCall.args;
      }
      if (toolCall.toolName === "visualizeBusiestDays") {
        return toolCall.args;
      }
    },
    body: {
      preferences: queryClient.getQueryData(["preferences"]),
    },
    onFinish() {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["preferences"] });
      }, 1000);
    },
  });

  const endRef = useScrollToBottom<HTMLDivElement>(messages);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const connectionStatus = queryClient.getQueryData<{
      connections: { google: boolean };
    }>(["connectionsStatus"]);

    if (!connectionStatus?.connections.google) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: generateId(),
          role: "user",
          content: input,
        },
        {
          id: generateId(),
          role: "assistant",
          content:
            "It looks like you haven't connected your Google Calendar. Please connect it to continue.",
          createdAt: new Date(),
        },
      ]);
      setInput("");
      return;
    }
    handleSubmit(e);
  };
  const handleReset = () => {
    setMessages([]);
  };
  const handleSuggestionsClick = (prompt: string) => {
    append({
      id: generateId(),
      role: "user",
      content: prompt,
    });
  };

  return (
    <div className="w-full rounded-lg border-2 border-tertiary shadow-sm flex flex-col h-[80vh]">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-6 max-h-[100%]">
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            addToolResult={addToolResult}
          />
        ))}
        {status === "submitted" && <AILoader />}
        {error && <AIError reload={reload} />}
        {messages.length === 0 && (
          <Suggestions
            suggestions={suggestions}
            onClick={handleSuggestionsClick}
          />
        )}
        <div ref={endRef} />
      </div>
      <Preferences />
      <div className="border-t-2 border-tertiary p-2">
        <form
          onSubmit={onSubmit}
          className="relative flex flex-row items-center gap-2"
        >
          <div className="p-3 shadow-none rounded-md bg-tertiary flex items-center justify-center">
            <IconButton onClick={handleReset} type="button">
              <RefreshCcw className="w-6 h-6" />
            </IconButton>
          </div>
          <label htmlFor="chat-input" className="sr-only">
            Your Query
          </label>
          <input
            id="chat-input"
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Send a message..."
            className="w-full bg-tertiary text-foreground px-4 py-3 pr-12 rounded-md"
          />
          <button
            type="submit"
            disabled={!input || status !== "ready"}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md disabled:opacity-50"
          >
            <SendHorizontal className="w-5 h-5" />
            <span className="sr-only">Send message</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
