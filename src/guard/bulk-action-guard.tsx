import { createGuard } from "@/guard/create-guard";
import { isFrom } from "@/lib/utils/router";
import { add0x } from "@/lib/utils/strings";

export const [BulkActionGuard, useBulkActionContext] = createGuard(
  {
    _selectedPublicKeys: [] as string[],
    get selectedPublicKeys(): string[] {
      return this._selectedPublicKeys.map(add0x);
    },
    set selectedPublicKeys(keys: string[]) {
      this._selectedPublicKeys = keys;
    },
  },
  {
    "/clusters/:clusterHash/:action/confirmation": (state, { match }) => {
      if (isFrom("/clusters/:clusterHash/:action/success")) return "..";
      if (!["exit", "remove"].includes(match.params.action ?? "")) return;
      if (!state.selectedPublicKeys.length) return `..`;
    },
  },
);
