"use client";
import Button from "@/components/common/Button";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function Logout() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const logout = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        window.alert("Something went wrong. Unable to logout!");
      } else {
        router.replace("/login");
      }
    } catch {
      window.alert("Something went wrong. Unable to logout!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className="flex flex-row gap-2 text-sm"
      variant="destructive"
      onClick={logout}
      disabled={loading}
    >
      {<LogOut className="w-5 h-5" />}
      {loading ? "Logging out..." : "Logout"}
    </Button>
  );
}

export default Logout;
