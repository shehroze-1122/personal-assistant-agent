"use client";
import React, { useState } from "react";
import { Cable, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import ConnectGoogleCalendar from "./ConnectGoogleCalendar";
import useConnectionsStatus from "./useConnectionsStatus";
import IconButton from "../common/IconButton";
import Status from "../common/Status";
import Loader from "../common/Loader";

function Connections() {
  const [expanded, setIsExpanded] = useState(false);
  const { data, isLoading, isError } = useConnectionsStatus();
  const toggleExpanded = () => {
    setIsExpanded((previousState) => !previousState);
  };

  return (
    <div className="w-full rounded-lg border-2 border-tertiary shadow-sm p-3">
      <div className="flex flex-row justify-between items-center">
        <h1 className="flex flex-row items-center gap-1">
          <Cable className="w-4 h-4" />
          Connections
        </h1>
        <div className="flex flex-row items-center gap-3">
          <Status
            status={data?.connections.google ? "connected" : "disconnected"}
          />
          <IconButton disabled={isLoading} onClick={toggleExpanded}>
            {expanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </IconButton>
        </div>
      </div>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        {expanded && (
          <div className="mt-3">
            {data && (
              <ConnectGoogleCalendar connected={data.connections.google} />
            )}
            {isLoading && <Loader />}
            {isError && !data && <p>Failed to get connections.</p>}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Connections;
