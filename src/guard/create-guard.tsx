/* eslint-disable react-hooks/rules-of-hooks */
import type { RoutePaths } from "@/app/routes/router";
import { reset } from "@/lib/utils/valtio";
import type { ReactNode } from "react";
import React, { useMemo } from "react";
import { useLocation, matchPath, Navigate } from "react-router";
import { proxy, useSnapshot } from "valtio";

export const createGuard = <T extends object>(
  defaultState: T,
  guard: Partial<
    Record<RoutePaths, (state: T, reset: () => void) => string | void>
  > = {},
) => {
  const state = proxy<T>(defaultState);
  const resetState = reset.bind(null, state, defaultState);

  const hook = () => useSnapshot(state);
  hook.state = state;

  const guardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const location = useLocation();
    const guards = useMemo(() => Object.entries(guard), []);

    for (const [pattern, guardFn] of guards) {
      const match = Boolean(matchPath(pattern, location.pathname));
      if (!match) continue;
      const path = guardFn(state, resetState);
      if (path) return <Navigate to={path} replace />;
    }

    return <>{children}</>;
  };

  return [guardProvider, hook] as const;
};
