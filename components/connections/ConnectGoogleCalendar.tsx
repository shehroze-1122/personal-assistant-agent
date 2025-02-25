import React, { useState } from "react";
import Button from "../common/Button";
import Image from "next/image";
import { connectGoogleCalendar, disconnectGoogleCalendar } from "@/lib/actions";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getUser } from "@/lib/utils";

type ConnectGoogleCalendarProps = {
  connected: boolean;
};
function ConnectGoogleCalendar({ connected }: ConnectGoogleCalendarProps) {
  const queryClient = useQueryClient();
  const [isRemoveLoading, setIsRemoveLoading] = useState(false);

  const handleRemove = async () => {
    try {
      setIsRemoveLoading(true);
      const user = await getUser(createClient());
      if (!user) {
        throw new Error("User not found");
      }
      await disconnectGoogleCalendar(user.id);
    } catch (error) {
      console.error(error);
      window.alert("Failed to disconnect Google Calendar");
    } finally {
      setIsRemoveLoading(false);
      queryClient.invalidateQueries({
        queryKey: ["connectionsStatus"],
      });
    }
  };

  return (
    <div className="flex flex-row gap-2 items-center">
      <Image src="/google.svg" alt="Google Logo" height={25} width={25} />:{" "}
      {!connected && <Button onClick={connectGoogleCalendar}>Connect</Button>}
      {connected && (
        <Button variant="destructive" onClick={handleRemove}>
          {isRemoveLoading ? "Disconnecting..." : "Disconnect"}
        </Button>
      )}
    </div>
  );
}

export default ConnectGoogleCalendar;
