import React from "react";
import { User } from "lucide-react";

function UserAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center shrink-0">
      <User className="w-6 h-6" />
    </div>
  );
}

export default UserAvatar;
