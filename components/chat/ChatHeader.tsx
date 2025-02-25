import Image from "next/image";
import React from "react";
import monogram from "./monogram.png";

function ChatHeader() {
  return (
    <div className="flex items-center p-2 border-b border-b-tertiary">
      <div className="relative w-10 h-10 mr-2 rounded-full bg-tertiary overflow-hidden">
        <Image
          src={monogram}
          alt="EngAIagent monogram"
          layout="fill"
          objectFit="cover"
          placeholder="blur"
        />
      </div>
      <div>
        <h2 className="font-semibold">EngAIagent</h2>
        <p className="text-sm text-foregroundSecondary">
          Chief Meetings Officer
        </p>
      </div>
    </div>
  );
}

export default ChatHeader;
