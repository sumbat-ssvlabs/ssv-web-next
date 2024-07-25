import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { globals } from "@/config";
import { useFundingCost } from "@/hooks/use-funding-cost";
import { getOperatorQueryOptions } from "@/hooks/use-operator";
import { cn } from "@/lib/utils/tw";
import { createValidatorFlow } from "@/signals/create-cluster-signals";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueries } from "@tanstack/react-query";
import { isEmpty } from "lodash-es";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Collapse } from "react-collapse";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { formatEther } from "viem";
import { z } from "zod";

const schema = z.object({
  days: z.coerce.number().positive(),
});

export type FundingFormProps = {
  onSubmit: (data: z.infer<typeof schema>) => void;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"form">, keyof FundingFormProps> &
    FundingFormProps
>;

export const FundingForm: FCProps = ({ className, onSubmit, ...props }) => {
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      days: 365,
    },
    resolver: zodResolver(schema),
  });
  const results = useQueries({
    queries: createValidatorFlow.selectedOperatorIds.value.map((id) =>
      getOperatorQueryOptions(id),
    ),
  });
  const isLoading = results.some((result) => result.isLoading);

  const days = form.watch("days");
  const showLiquidationWarning =
    !isEmpty(days) && days < globals.CLUSTER_VALIDITY_PERIOD_MINIMUM;

  const { data } = useFundingCost({
    fundingDays: form.watch("days"),
    operatorsFee: results.reduce(
      (acc, { data }) => acc + BigInt(data?.data.fee || 0n),
      0n,
    ),
    validators: 1,
  });
  console.log("data:", data);
  const a = formatEther(data || 0n);

  return (
    <form
      className={cn(className, "flex flex-col gap-2 max-w-[620px]")}
      onSubmit={form.handleSubmit(onSubmit)}
      {...props}
    >
      <Input
        type="number"
        {...form.register("days")}
        rightSlot={
          <Text variant="body-2-semibold" className="px-3">
            Days
          </Text>
        }
      />
      {form.formState.errors.days && (
        <Text>{form.formState.errors.days.message}</Text>
      )}
      {isLoading ? "Loading..." : `${a}ssv `}

      <Collapse isOpened={showLiquidationWarning}>
        <Alert variant="error">
          This period is low and could put your validator at risk. To avoid
          liquidation please input a longer period.{" "}
          <Link
            to="https://docs.ssv.network/learn/protocol-overview/tokenomics/liquidations"
            target="_blank"
            className="underline text-primary-700"
          >
            Learn more on liquidations
          </Link>
        </Alert>
      </Collapse>
      <Button type="submit">Next</Button>
    </form>
  );
};

FundingForm.displayName = "FundingForm";
