import Button from "@/components/common/Button";
import { AskForConfirmation } from "@/lib/tools/schemas";
import React from "react";
import Markdown from "../Markdown";
import { User } from "lucide-react";

type ConfirmationMessageProps = AskForConfirmation & {
  addToolResult: ({
    toolCallId,
    result,
  }: {
    toolCallId: string;
    result: unknown;
  }) => void;
  state: "call" | "result";
  toolCallId: string;
  result?: string;
};

function ConfirmationMessage({
  message,
  addToolResult,
  toolCallId,
  state,
  result,
}: ConfirmationMessageProps) {
  const handleYes = () => {
    addToolResult({ toolCallId, result: "Sounds good." });
  };
  const handleNo = () => {
    addToolResult({ toolCallId, result: "Doesn't sound good" });
  };
  return (
    <div>
      <Markdown>{message}</Markdown>
      {state === "call" && (
        <div className="flex flex-row gap-3 mt-3">
          <Button onClick={handleYes}>Sounds Good</Button>
          <Button onClick={handleNo} variant="destructive">
            Nah
          </Button>
        </div>
      )}
      {state === "result" && !!result && (
        <div className="flex items-center gap-3 my-3">
          <div className="w-7 h-7 rounded-full bg-tertiary flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>{" "}
          {result}
        </div>
      )}
    </div>
  );
}

export default ConfirmationMessage;
