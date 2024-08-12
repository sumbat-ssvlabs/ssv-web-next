import { type FC } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Span, Text } from "@/components/ui/text";
import { useRegisterOperatorState } from "@/context/create-operator-context";
import { useAccount } from "wagmi";
import { shortenAddress } from "@/lib/utils/strings";
import { formatSSV } from "@/lib/utils/number";
import { OperatorStatusBadge } from "@/components/operator/operator-permission/operator-status-badge";
import { Button } from "@/components/ui/button";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { globals } from "@/config";
import { useRegisterOperator } from "@/lib/contract-interactions/write/use-register-operator";
import { createOperatorFromEvent } from "@/lib/utils/operator";
import { toast } from "@/components/ui/use-toast";
import { getOperatorQueryOptions } from "@/hooks/use-operator";
import { queryClient } from "@/lib/react-query";
import { useNavigate } from "react-router";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { encodeAbiParameters, parseAbiParameters } from "viem";
import { roundOperatorFee } from "@/lib/utils/bigint";
import { getCreatedOptimisticOperatorsQueryOptions } from "@/hooks/operator/use-created-optimistic-operators";
import { useKey } from "react-use";

export const RegisterOperatorConfirmation: FC = () => {
  const navigate = useNavigate();

  const { address } = useAccount();
  const { publicKey, yearlyFee, isPrivate } = useRegisterOperatorState();

  const register = useRegisterOperator();

  const submit = () => {
    register.write(
      {
        setPrivate: isPrivate,
        fee: roundOperatorFee(yearlyFee / globals.BLOCKS_PER_YEAR),
        publicKey: encodeAbiParameters(parseAbiParameters("string"), [
          publicKey,
        ]),
      },
      withTransactionModal({
        onMined: (receipt) => {
          const event = receipt.events?.find(
            (event) => event.eventName === "OperatorAdded",
          );

          if (!event)
            return toast({
              title: "Operator Added But...",
              description:
                "But you will see the operator in the list after the next block",
            });

          const operator = createOperatorFromEvent(event);

          queryClient.setQueryData(
            getOperatorQueryOptions(operator.id).queryKey,
            operator,
          );

          queryClient.setQueryData(
            getCreatedOptimisticOperatorsQueryOptions().queryKey,
            (prev) => {
              if (!prev) return [operator];
              return [...prev, operator];
            },
          );

          navigate(`/operators`);
          // navigate(`../success?operatorId=${operator.id}`);
        },
      }),
    );
  };

  useKey("Enter", submit);

  return (
    <Container variant="vertical">
      <NavigateBackBtn by="history" />
      <Card
        as="form"
        className="w-full"
        onSubmit={(ev) => {
          ev.preventDefault();
          submit();
        }}
      >
        <Text variant="headline4">Transaction Details</Text>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center gap-4">
            <Text
              variant="body-2-medium"
              className="font-semibold text-sm text-gray-500"
            >
              Owner Address
            </Text>
            <Text variant="body-2-bold">{shortenAddress(address ?? "")}</Text>
          </div>
          <div className="flex justify-between items-center gap-4">
            <Text
              variant="body-2-medium"
              className="font-semibold text-sm text-gray-500"
            >
              Operator public key
            </Text>
            <Text variant="body-2-bold">
              {" "}
              {shortenAddress(publicKey ?? "")}
            </Text>
          </div>

          <div className="flex justify-between">
            <Text
              variant="body-2-medium"
              className="font-semibold text-sm text-gray-500"
            >
              Fee
            </Text>
            <div className="flex flex-col gap-0">
              <Text variant="body-2-bold">
                {formatSSV(yearlyFee)} SSV{" "}
                <Span variant="body-3-semibold" className="text-gray-500">
                  / year
                </Span>
              </Text>
            </div>
          </div>

          <div className="flex justify-between">
            <Text
              variant="body-2-medium"
              className="font-semibold text-sm text-gray-500"
            >
              Status
            </Text>
            <OperatorStatusBadge isPrivate={isPrivate} />
          </div>
        </div>
        <Button
          type="submit"
          size="xl"
          isLoading={register.isPending}
          isActionBtn
        >
          Confirm
        </Button>
      </Card>
    </Container>
  );
};

RegisterOperatorConfirmation.displayName = "RegisterOperatorConfirmation";
