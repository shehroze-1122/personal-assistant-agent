"use client";
import { ChevronDown, ChevronUp, LoaderIcon } from "lucide-react";
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
        <h1 className="flex flex-row-reverse items-center gap-1">
          <div
            className={`w-3 h-3 rounded-full ${
              data?.connections.google ? "bg-green-400" : "bg-red-400"
            }`}
          />{" "}
          Connections
        </h1>
        <button
          className=" border-none bg-transparent p-0 m-0 shadow-none"
          onClick={toggleExpanded}
        >
          {expanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        {expanded && data && (
          <div
            className={`
            overflow-hidden transition-all duration-1000 ease-in-out
            ${expanded ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"}
          `}
          >
            <ConnectGoogleCalendar connected={data.connections.google} />
          </div>
        )}
        {isLoading && <LoaderIcon className="animate-spin w-5 h-5 mt-3" />}
      </motion.div>
    </div>
  );
}

export default Connections;
