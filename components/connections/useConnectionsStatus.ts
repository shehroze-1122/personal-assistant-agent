import { useQuery } from "@tanstack/react-query";

function useConnectionsStatus() {
  const response = useQuery({
    queryKey: ["connectionsStatus"],
    queryFn: async () => {
      const response = await fetch("/api/connections/status");
      const data: { connections: { google: boolean } } = await response.json();
      return data;
    },
  });
  return response;
}

export default useConnectionsStatus;
