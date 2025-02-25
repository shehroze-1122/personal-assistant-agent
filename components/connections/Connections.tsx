"use client";
import { Cable, ChevronDown, ChevronUp, LoaderIcon } from "lucide-react";
import React, { useState } from "react";
import { motion } from "framer-motion";
import ConnectGoogleCalendar from "./ConnectGoogleCalendar";
import useConnectionsStatus from "./useConnectionsStatus";

function Connections() {
  const [expanded, setIsExpanded] = useState(false);
  const { data, isLoading } = useConnectionsStatus();
  const toggleExpanded = () => {
    setIsExpanded((previousState) => !previousState);
  };
  console.log({ data });
  return (
    <div className="w-full rounded-lg border-2 border-tertiary shadow-sm p-3">
      <div className="flex flex-row justify-between items-center">
        <h1 className="flex flex-row items-center gap-1">
          <Cable className="w-4 h-4" />
          Connections
        </h1>
        <div className="flex flex-row items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              data?.connections.google ? "bg-green-400" : "bg-red-400"
            }`}
          />
          <button
            className=" border-none bg-transparent p-0 m-0 shadow-none"
            disabled={isLoading}
            onClick={toggleExpanded}
          >
            {expanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        {expanded && data && (
          <div className="mt-3">
            <ConnectGoogleCalendar connected={data.connections.google} />
          </div>
        )}
        {isLoading && <LoaderIcon className="animate-spin w-5 h-5 mt-3" />}
      </motion.div>
    </div>
  );
}

export default Connections;
