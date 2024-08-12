import { cloneDeep } from "lodash-es";

export const reset = <T extends object>(state: T, defaultState: T) => {
  const resetObj = cloneDeep(defaultState);
  Object.entries(resetObj).forEach(([key, value]) => {
    // @ts-expect-error - This is a valid assignment
    state[key] = value;
  });
};
