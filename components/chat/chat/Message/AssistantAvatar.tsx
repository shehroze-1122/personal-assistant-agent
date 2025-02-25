import React from "react";
import { Bot } from "lucide-react";

function AssistantAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center shrink-0">
      <Bot className="w-6 h-6" />
    </div>
  );
}

export default AssistantAvatar;
