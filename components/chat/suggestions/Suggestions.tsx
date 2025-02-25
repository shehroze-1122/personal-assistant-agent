import React from "react";
import Suggestion from "./Suggestion";

type SuggestionsProps = {
  suggestions: string[];
  onClick: (prompt: string) => void;
};

function Suggestions({ suggestions, onClick }: SuggestionsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {suggestions.map((suggestion, index) => (
        <Suggestion
          key={index}
          className="basis-[49%]"
          suggestion={suggestion}
          onClick={onClick}
        />
      ))}
    </div>
  );
}

export default Suggestions;
