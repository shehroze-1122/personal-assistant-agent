import { mergeClasses } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";
import React from "react";

type LoaderProps = {
  className?: string;
};

function Loader({ className }: LoaderProps) {
  const baseClasses = "animate-spin w-5 h-5";
  const mergedClasses = mergeClasses(baseClasses, className);

  return <LoaderIcon className={mergedClasses} />;
}

export default Loader;
