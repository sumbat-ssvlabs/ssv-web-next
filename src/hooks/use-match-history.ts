import { useMemo } from "react";
import { useSnapshot } from "valtio";
import { locationState } from "@/app/routes/router";
import { matchPath } from "react-router";

export function useMatchHistory(pattern: string) {
  const state = useSnapshot(locationState);
  console.log("state:", state.history);
  return useMemo(() => {
    return [...state.history]
      .reverse()
      .find((location) => matchPath(pattern, location.pathname));
  }, [pattern, state]);
}
