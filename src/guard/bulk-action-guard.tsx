import { createGuard } from "@/guard/create-guard";
import { add0x } from "@/lib/utils/strings";

export const [BulkActionGuard, useBulkActionContext] = createGuard(
  {
    _selectedPublicKeys: [] as string[],
    get selectedPublicKeys(): string[] {
      return this._selectedPublicKeys.map(add0x);
    },
    set selectedPublicKeys(keys: string[]) {
      this._selectedPublicKeys = keys.map((key) => key.replace(/^0x/, ""));
    },
  },
  {
    "/clusters/:clusterHash/remove/confirmation": (state, { params }) => {
      if (!state._selectedPublicKeys.length)
        return `/clusters/${params.clusterHash}/remove`;
    },
  },
);

export const [UpdateOperatorFeeGuard, useUpdateOperatorFeeContext] =
  createGuard({
    previousYearlyFee: 0n,
    newYearlyFee: 0n,
  });
