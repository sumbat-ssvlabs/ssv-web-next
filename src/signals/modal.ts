import { proxy, useSnapshot } from "valtio";

interface ModalProxy<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  open: boolean;
  onOpenChange(open: boolean): void;
  openModal(meta?: T): void;
  meta: Partial<T>;
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
    openModal: (meta) => {
      if (meta) state.meta = meta;
      state.open = true;
    },
    meta: defaults?.meta ?? {},
  });
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const hook = () => useSnapshot(state);
  hook.state = state;
  return hook;
};

export const useTransactionModal = createModalSignal<{
  hash: string;
}>();
