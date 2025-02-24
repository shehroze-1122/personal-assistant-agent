"use client";

import { useScrollToBottom } from "@/hooks/useScrollToBottom";
import { useChat } from "@ai-sdk/react";
import { Bot, SendHorizontal, User } from "lucide-react";
import React from "react";
import Markdown from "../Markdown";
import { TimeDistributionPieChart } from "@/components/chat/chat/charts/TimeDistributionPieChart";
import EventFrequencyByDayChart from "./charts/EventFrequencyByDayChart";
import ConfirmationMessage from "./ConfirmationMessage";
import { generateId } from "ai";
import { useQueryClient } from "@tanstack/react-query";

function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    addToolResult,
    setMessages,
    setInput,
  } = useChat({
    onToolCall({ toolCall }) {
      if (toolCall.toolName === "visualizeTimeSpentOnCategoriesTool") {
        return toolCall.args;
      }
      if (toolCall.toolName === "visualizeBusiestDays") {
        return toolCall.args;
      }
    },
  });
  const queryClient = useQueryClient();

  const endRef = useScrollToBottom<HTMLDivElement>(messages);

  console.log({ messages });
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
  return (
    <div className="w-full rounded-lg border-2 border-tertiary shadow-sm flex flex-col min-h-[80vh]">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 max-h-[80vh]">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start gap-3">
            {message.role === "assistant" ? (
              <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center shrink-0">
                <User className="w-6 h-6" />
              </div>
            )}
            <div className="text-foreground leading-relaxed">
              {message.parts.map((part) => {
                switch (part.type) {
                  case "text":
                    return (
                      <Markdown key={`${message.id}text`}>{part.text}</Markdown>
                    );
                  case "tool-invocation": {
                    const callId = part.toolInvocation.toolCallId;
                    switch (part.toolInvocation.toolName) {
                      case "visualizeTimeSpentOnCategoriesTool":
                        if (part.toolInvocation.state === "result") {
                          return (
                            <TimeDistributionPieChart
                              key={callId}
                              data={part.toolInvocation.result.data}
                            />
                          );
                        }
                      case "visualizeBusiestDays":
                        if (part.toolInvocation.state === "result") {
                          return (
                            <EventFrequencyByDayChart
                              key={callId}
                              data={part.toolInvocation.result.data}
                            />
                          );
                        }
                      case "askForConfirmationTool":
                        if (
                          part.toolInvocation.state === "call" ||
                          part.toolInvocation.state === "result"
                        ) {
                          return (
                            <ConfirmationMessage
                              key={callId}
                              addToolResult={addToolResult}
                              message={part.toolInvocation.args.message}
                              result={
                                part.toolInvocation.state === "result"
                                  ? part.toolInvocation.result
                                  : undefined
                              }
                              state={part.toolInvocation.state}
                              toolCallId={callId}
                            />
                          );
                        }
                    }
                  }
                }
              })}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="border-t-2 border-tertiary p-4">
        <form onSubmit={onSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Send a message..."
            className="w-full bg-tertiary text-foreground px-4 py-3 pr-12 rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
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
