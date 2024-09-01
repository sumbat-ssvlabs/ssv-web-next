import { locationState } from "@/hooks/use-subscribe-to-path-changes";
import { matchPath } from "react-router";

export const isFrom = (pattern: string) => {
  return matchPath(pattern, locationState.previous);
};
