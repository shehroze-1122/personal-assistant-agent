import { mergeClasses } from "@/lib/utils";
import React from "react";

type SuggestionProps = {
  suggestion: string;
  onClick: (suggestion: string) => void;
  className?: string;
};

function Suggestion({ suggestion, onClick, className }: SuggestionProps) {
  const baseClasses = "p-3 border border-tertiary rounded-md shadow-md";
  const classes = mergeClasses(baseClasses, className);

  const handleClick = () => {
    onClick(suggestion);
  };
  return (
    <button className={classes} onClick={handleClick}>
      {suggestion}
    </button>
  );
}

export default Suggestion;
