import { getOwnerNonce } from "@/api/account";
import { getClusterData } from "@/api/cluster";
import { FundingForm } from "@/components/funding/funding-form";
import { useComputeFundingCost } from "@/hooks/use-compute-funding-cost";
import { useCreateShares } from "@/hooks/use-create-shares";
import { getOperatorQueryOptions } from "@/hooks/use-operator";
import { getClusterHash } from "@/lib/utils/cluster";
import { prepareOperatorsForShares } from "@/lib/utils/operator";
import { cn } from "@/lib/utils/tw";
import { createValidatorFlow } from "@/signals/create-cluster-signals";
import { useQueries } from "@tanstack/react-query";
import type { ComponentProps, ComponentPropsWithoutRef, FC } from "react";
import { useAccount } from "wagmi";

export type FundingProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof FundingProps> & FundingProps
>;

export const Funding: FCProps = ({ className, ...props }) => {
  const { address } = useAccount();
  const results = useQueries({
    queries: createValidatorFlow.selectedOperatorIds.value.map((id) =>
      getOperatorQueryOptions(id),
    ),
  });

  const isLoading = results.some((result) => result.isLoading);
  const computeFundingCost = useComputeFundingCost();
  const createShares = useCreateShares();

  const handleSubmit: ComponentProps<typeof FundingForm>["onSubmit"] = async ({
    days,
  }) => {
    const cost = await computeFundingCost.mutateAsync({
      fundingDays: days,
      operatorsFee: results.reduce(
        (acc, { data }) => acc + BigInt(data?.data.fee || 0n),
        0n,
      ),
      validators: 1,
    });

    const adata = await createShares.mutateAsync({
      account: address!,
      clusterData: await getClusterData(
        getClusterHash(address!, createValidatorFlow.selectedOperatorIds.value),
      ),
      nonce: await getOwnerNonce(address!),
      operators: prepareOperatorsForShares(
        results.map((result) => result.data!.data!),
      ),
      privateKey: createValidatorFlow.extractedKeys.value.privateKey,
    });

    console.log("days", days, "cost", cost, "adata", adata);
  };

  return (
    <div className={cn(className)} {...props}>
      {createShares.isError && <div>Error: {createShares.error.message}</div>}
      {isLoading || createShares.isPending ? (
        <div>Loading...</div>
      ) : (
        <FundingForm onSubmit={handleSubmit} />
      )}
    </div>
  );
};

Funding.displayName = "Funding";
