import React from "react";

type StatusProps = {
  status: "connected" | "disconnected";
};
function Status({ status }: StatusProps) {
  return (
    <div
      className={`w-3 h-3 rounded-full ${
        status === "connected" ? "bg-green-400" : "bg-red-400"
      }`}
    />
  );
}

export default Status;
