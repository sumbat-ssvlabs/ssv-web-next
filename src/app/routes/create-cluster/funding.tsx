import { getOwnerNonce } from "@/api/account";
import { useComputeFundingCost } from "@/hooks/use-compute-funding-cost";
import { useCreateShares } from "@/hooks/use-create-shares";
import { getOperatorQueryOptions } from "@/hooks/operator/use-operator";
import { prepareOperatorsForShares, sortOperators } from "@/lib/utils/operator";
import { useQueries, useQuery } from "@tanstack/react-query";
import type { ComponentPropsWithoutRef, FC } from "react";
import { useAccount } from "wagmi";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { globals } from "@/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "lodash-es";
import { Link } from "lucide-react";
import { Collapse } from "react-collapse";
import { useForm } from "react-hook-form";
import { TbAlertTriangleFilled } from "react-icons/tb";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { Container } from "@/components/ui/container";
import { formatSSV } from "@/lib/utils/number";
import { serialize } from "@wagmi/core";
import { useRegisterValidator } from "@/lib/contract-interactions/write/use-register-validator";
import { createClusterHash } from "@/lib/utils/cluster";
import { getClusterData } from "@/api/cluster";
import type { Address } from "abitype";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { useRegisterValidatorContext } from "@/guard/register-validator-guard";

export type FundingProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof FundingProps> & FundingProps
>;

const schema = z.object({
  days: z.coerce.number().positive(),
});

export const Funding: FCProps = ({ ...props }) => {
  const { address } = useAccount();
  const { selectedOperatorsIds, extractedKeys } = useRegisterValidatorContext();

  const results = useQueries({
    queries: selectedOperatorsIds.map((id) => getOperatorQueryOptions(id)),
  });

  const isLoading = results.some((result) => result.isLoading);
  const operatorsFee = results.reduce(
    (acc, { data }) => acc + BigInt(data?.fee || 0n),
    0n,
  );

  const computeFundingCost = useComputeFundingCost();
  const createShares = useCreateShares();
  const registerValidator = useRegisterValidator();

  const isPending = createShares.isPending || computeFundingCost.isPending;

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      days: 365,
    },
    resolver: zodResolver(schema),
  });

  const days = form.watch("days");
  const showLiquidationWarning =
    !isEmpty(days) && days < globals.CLUSTER_VALIDITY_PERIOD_MINIMUM;

  const fundingCost = useQuery({
    queryKey: ["fundingCost", days, operatorsFee].map((v) => serialize(v)),
    queryFn: () =>
      computeFundingCost.mutateAsync({
        fundingDays: days,
        operatorsFee,
        validators: 1,
      }),
  });

  const submit = form.handleSubmit(async ({ days }) => {
    const amount = await computeFundingCost.mutateAsync({
      fundingDays: days,
      operatorsFee,
      validators: 1,
    });

    const operators = prepareOperatorsForShares(
      results.map((result) => result.data!),
    );

    const nonce = await getOwnerNonce(address!);

    const shares = await createShares.mutateAsync({
      account: address!,
      nonce: nonce,
      operators,
      privateKey: extractedKeys.privateKey,
    });

    const clusterHash = createClusterHash(address!, operators);
    const args = {
      amount,
      cluster: await getClusterData(clusterHash),
      operatorIds: sortOperators(operators).map(({ id }) => BigInt(id)),
      publicKey: extractedKeys.publicKey as Address,
      sharesData: shares.sharesData as Address,
    };

    registerValidator.write(
      args,
      withTransactionModal({
        onMined: (receipt) => {
          console.log("receipt.events:", receipt.events);
        },
      }),
    );
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Container>
      <Form {...form}>
        <Card as="form" onSubmit={submit} {...props}>
          <Text variant="headline4">Select your validator funding period</Text>
          <Text>
            The SSV amount you deposit will determine your validator operational
            runway (You can always manage it later by withdrawing or depositing
            more funds).
          </Text>
          {JSON.stringify(extractedKeys.publicKey)}
          <FormField
            control={form.control}
            name="days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Days {formatSSV(fundingCost.data ?? 0n)}SSV
                </FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Collapse isOpened={showLiquidationWarning}>
            <Alert variant="warning">
              <div className="flex items-center gap-4">
                <TbAlertTriangleFilled className="text-orange-500 size-8" />
                <div>
                  This period is low and could put your validator at risk. To
                  avoid liquidation please input a longer period.{" "}
                  <Link
                    to="https://docs.ssv.network/learn/protocol-overview/tokenomics/liquidations"
                    target="_blank"
                    className="underline text-primary-700"
                  >
                    Learn more on liquidations
                  </Link>
                </div>
              </div>
            </Alert>
          </Collapse>
          <Button
            type="submit"
            isLoading={isPending || registerValidator.isPending}
          >
            Next
          </Button>
        </Card>
      </Form>
    </Container>
  );
};

Funding.displayName = "Funding";
