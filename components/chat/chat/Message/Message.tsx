import React from "react";
import { UIMessage } from "ai";
import Markdown from "../../Markdown";
import { TimeDistributionPieChart } from "../charts/TimeDistributionPieChart";
import EventFrequencyByDayChart from "../charts/EventFrequencyByDayChart";
import ConfirmationMessage from "../ConfirmationMessage";
import UserAvatar from "./UserAvatar";
import AssistantAvatar from "./AssistantAvatar";

type MessageProps = {
  message: UIMessage;
  addToolResult: ({
    toolCallId,
    result,
  }: {
    toolCallId: string;
    result: unknown;
  }) => void;
};

function Message({ message, addToolResult }: MessageProps) {
  return (
    <div className="flex items-start gap-3">
      {message.role === "assistant" ? <AssistantAvatar /> : <UserAvatar />}
      <div className="text-foreground leading-relaxed">
        {message.parts.map((part) => {
          switch (part.type) {
            case "text":
              return (
                <Markdown key={`${message.id}-text`}>{part.text}</Markdown>
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
  );
}

export default Message;
