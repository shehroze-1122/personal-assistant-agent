import { useQuery } from "@tanstack/react-query";

function usePreferences() {
  const response = useQuery({
    queryKey: ["preferences"],
    queryFn: async () => {
      const response = await fetch("/api/preferences");
      const data: { preferences: { id: string; preference: string }[] } =
        await response.json();
      return data.preferences;
    },
  });
  return response;
}

export default usePreferences;
