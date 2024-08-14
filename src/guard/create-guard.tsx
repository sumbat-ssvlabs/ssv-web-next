/* eslint-disable react-hooks/rules-of-hooks */
import { reset } from "@/lib/utils/valtio";
import type { ReactNode } from "react";
import React from "react";
import { useMatch, useNavigate } from "react-router";
import { useEffectOnce } from "react-use";
import { proxy, useSnapshot } from "valtio";

export const createGuard = <T extends object>(
  defaultState: T,
  route: string,
) => {
  const state = proxy<T>(defaultState);

  const guardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const match = Boolean(useMatch(route));
    useEffectOnce(() => {
      !match && navigate(route);
      return () => reset(state, defaultState);
    });
    return <>{children}</>;
  };

  const hook = () => useSnapshot(state);
  hook.state = state;

  return [guardProvider, hook] as const;
};
