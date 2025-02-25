import React from "react";
import TextShimmer from "@/components/common/TextShimmer";
import { Bot } from "lucide-react";

function AILoader() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center shrink-0">
        <Bot className="w-6 h-6" />
      </div>
      <TextShimmer duration={1}>is cooking...</TextShimmer>
    </div>
  );
}

export default AILoader;
