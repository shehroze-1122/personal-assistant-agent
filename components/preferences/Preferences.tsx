import React, { useState } from "react";
import { CheckCircle, ChevronDown, ChevronUp, Save } from "lucide-react";
import { motion } from "framer-motion";
import usePreferences from "./usePreferences";
import IconButton from "../common/IconButton";
import Loader from "../common/Loader";

function Preferences() {
  const [expanded, setIsExpanded] = useState(false);
  const { data, isLoading, isError } = usePreferences();

  const toggleExpanded = () => {
    setIsExpanded((previousState) => !previousState);
  };

  return (
    <div className="w-full rounded-lg border-t-2 border-tertiary shadow-sm p-3">
      <div className="flex flex-row justify-between items-center">
        <h1 className="flex flex-row items-center gap-1">
          <Save className="w-4 h-4" /> Preferences
        </h1>
        <IconButton disabled={isLoading} onClick={toggleExpanded}>
          {expanded ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronUp className="w-5 h-5" />
          )}
        </IconButton>
      </div>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        {expanded && (
          <div className="mt-3">
            {data && data.length > 0 && (
              <ul className="space-y-3">
                {data.map(({ id, preference }) => (
                  <li key={id} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{preference}</span>
                  </li>
                ))}
              </ul>
            )}
            {isLoading && <Loader className="mt-3" />}
            {data && data.length === 0 && <p>No preferences saved yet.</p>}
            {!data && isError && <p>Failed to get preferences.</p>}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Preferences;
