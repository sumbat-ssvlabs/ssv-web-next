import { reactive } from "@/lib/utils/signals";

type CreateClusterFlow = {
  selectedOperatorIds: number[];
  keystoreFile: File | null;
};

export const createClusterFlow = reactive<CreateClusterFlow>({
  keystoreFile: null,
  selectedOperatorIds: [],
});
