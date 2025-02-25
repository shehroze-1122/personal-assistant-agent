"use client";

import Chat from "@/components/chat/chat";
import Connections from "@/components/connections";
import Preferences from "@/components/preferences";

export default function Agent() {
  return (
    <div className="w-full flex flex-col gap-3">
      <Connections />
      <Preferences />
      <Chat />
    </div>
  );
}
