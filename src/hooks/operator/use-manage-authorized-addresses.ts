import { useToast } from "@/components/ui/use-toast";
import { useAddAuthorizedAddresses } from "@/hooks/operator/use-add-authorized-addresses";
import { useDeleteAuthorizedAddresses } from "@/hooks/operator/use-delete-authorized-addresses";
import { getOperatorQueryOptions } from "@/hooks/use-operator";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { useRemoveOperatorsWhitelists } from "@/lib/contract-interactions/write/use-remove-operators-whitelists";
import { useSetOperatorsWhitelists } from "@/lib/contract-interactions/write/use-set-operators-whitelists";
import { mergeOperatorWhitelistAddresses } from "@/lib/utils/operator";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";

type Mode = "add" | "delete" | "view";

export const useManageAuthorizedAddresses = (_operatorId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const params = useParams<{ operatorId: string }>();
  const operatorId = _operatorId || params.operatorId;

  const set = useSetOperatorsWhitelists();
  const remove = useRemoveOperatorsWhitelists();

  const addManager = useAddAuthorizedAddresses();
  const deleteManager = useDeleteAuthorizedAddresses();

  const mode: Mode = addManager.hasAddresses
    ? "add"
    : deleteManager.hasAddresses
      ? "delete"
      : "view";

  const reset = () => {
    addManager.form.reset();
    deleteManager.reset();
  };

  const update = ({
    mode,
    params,
  }: {
    params: Parameters<typeof set.write | typeof remove.write>[0];
    mode: Mode;
  }) => {
    const isAdd = mode === "add";
    const writer = isAdd ? set : remove;
    writer.write(
      params,
      withTransactionModal({
        onMined: () => {
          toast({
            title: "Operator whitelist updated",
            description: new Date().toLocaleString(),
          });
          const queryKey = getOperatorQueryOptions(operatorId!).queryKey;
          queryClient.cancelQueries({ queryKey });
          queryClient.setQueryData(queryKey, (operator) => {
            return mergeOperatorWhitelistAddresses({
              shouldAdd: isAdd,
              operator: operator!,
              delta: params.whitelistAddresses,
            });
          });
          addManager.form.reset();
          deleteManager.reset();
        },
      }),
    );
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    switch (mode) {
      case "add": {
        addManager.form.handleSubmit(({ addresses }) => {
          const trimmedAddresses = addresses
            .map((a) => a.value)
            .filter((addr) => addr && addr.trim() !== "") as `0x${string}`[];

          update({
            mode: "add",
            params: {
              operatorIds: [BigInt(operatorId!)],
              whitelistAddresses: trimmedAddresses,
            },
          });
        })(event);
        break;
      }
      case "delete":
        update({
          mode: "delete",
          params: {
            operatorIds: [BigInt(operatorId!)],
            whitelistAddresses: deleteManager.addresses as `0x${string}`[],
          },
        });
        break;
    }
  };

  return {
    addManager,
    deleteManager,
    mode,
    submit,
    reset,
    update,
    isPending: set.isPending || remove.isPending,
  };
};
