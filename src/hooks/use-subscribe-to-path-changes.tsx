import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { proxy, useSnapshot } from "valtio";

interface PathState {
  current: string;
  previous: string;
}

export const locationState = proxy<PathState>({
  current: "/",
  previous: "",
});

export function useSubscribeToPathChanges() {
  const location = useLocation();
  const snapshot = useSnapshot(locationState);

  useEffect(() => {
    locationState.previous = locationState.current;
    locationState.current = location.pathname;
  }, [location.pathname]);

  return snapshot;
}
