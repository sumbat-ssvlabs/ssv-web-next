import { proxy, useSnapshot } from "valtio";

interface ModalProxy<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  open: boolean;
  onOpenChange?(open: boolean): void;
  openModal(meta: T): void;
  meta: T;
}

type Effects<T> = {
  meta?: T;
  open?: boolean;
};

const createModalSignal = <T extends Record<string, unknown>>(
  defaults?: Effects<T>,
) => {
  const state = proxy<ModalProxy<T>>({
    open: defaults?.open ?? false,
    onOpenChange: (open) => {
      state.open = open;
    },
    openModal: (meta: T) => {
      state.meta = meta;
      state.open = true;
    },
    meta: defaults?.meta ?? ({} as T),
  });
  return [state, () => useSnapshot(state)] as const;
};

export const [transactionModalProxy, useTransactionModal] = createModalSignal<{
  hash: string;
}>();
