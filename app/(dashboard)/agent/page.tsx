"use client";

import Chat from "@/components/chat";
import Connections from "@/components/connections";

export default function Agent() {
  return (
    <div className="w-full flex flex-col gap-3">
      <Connections />
      <Chat />
    </div>
  );
}
