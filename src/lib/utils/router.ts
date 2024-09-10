import { locationState } from "@/app/routes/router";
import { matchPath } from "react-router";

export const isFrom = (pattern: string) => {
  return matchPath(pattern, locationState.previous.pathname ?? "");
};

export const findInHistory = (pattern: string) => {
  console.log("locationState.history:", locationState.history);
  return locationState.history
    .reverse()
    .find((location) => matchPath(pattern, location.pathname));
};
