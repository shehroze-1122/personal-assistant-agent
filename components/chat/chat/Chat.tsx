"use client";

import { useScrollToBottom } from "@/hooks/useScrollToBottom";
import { useChat } from "@ai-sdk/react";
import { Bot, SendHorizontal, User } from "lucide-react";
import React from "react";
import Markdown from "../Markdown";
import { TimeDistributionPieChart } from "@/components/chat/chat/charts/TimeDistributionPieChart";
import EventFrequencyByDayChart from "./charts/EventFrequencyByDayChart";
import ConfirmationMessage from "./ConfirmationMessage";

function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    addToolResult,
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

  const endRef = useScrollToBottom<HTMLDivElement>(messages);

  console.log({ messages });

  return (
    <div className="w-full max-w-2xl rounded-lg border border-tertiary shadow-sm flex flex-col min-h-[80vh]">
      <div className="flex-1 overflow-y-scroll p-4 space-y-6 max-h-[80vh]">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start gap-3">
            {message.role === "assistant" ? (
              <div className="w-7 h-7 rounded-full bg-tertiary flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-tertiary flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
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
      <div className="border-t border-tertiary p-4">
        <form onSubmit={handleSubmit} className="relative">
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
