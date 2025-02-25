import React from "react";
import { Bot } from "lucide-react";
import Button from "../common/Button";

type AIErrorProps = {
  reload: () => void;
};

function AIError({ reload }: AIErrorProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center shrink-0">
        <Bot className="w-6 h-6" />
      </div>
      <div>
        <div>Oops. Something went wrong there.</div>
        <Button className="mt-3" type="button" onClick={reload}>
          Retry
        </Button>
      </div>
    </div>
  );
}

export default AIError;
