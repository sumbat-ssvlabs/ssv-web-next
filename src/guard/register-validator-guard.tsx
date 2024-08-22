import type { ClusterSize } from "@/components/operator/operator-picker/operator-cluster-size-picker";
import { createGuard } from "@/guard/create-guard";
import { ref } from "valtio";
import type { ExtractedKeys } from "ssv-keys/dist/tsc/src/lib/SSVKeys";

export const [RegisterValidatorGuard, useRegisterValidatorContext] =
  createGuard({
    clusterSize: 4 as ClusterSize,
    extractedKeys: {
      privateKey: "",
      publicKey: "",
    } satisfies ExtractedKeys,

    password: "",

    _files: [] as File[],
    set files(files: File[] | null) {
      this._files.splice(0);
      (files || []).forEach((file) => this._files.push(ref(file)));
    },

    get files() {
      return this._files;
    },

    _selectedOperatorsIds: [] as number[],
    set selectedOperatorsIds(ids: number[]) {
      this._selectedOperatorsIds = ids;
    },
    get selectedOperatorsIds() {
      return this._selectedOperatorsIds.slice(0, this.clusterSize);
    },
  });
