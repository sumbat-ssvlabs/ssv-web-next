import { useState, type FC } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { NumberInput } from "@/components/ui/number-input";
import { EstimatedOperationalRunway } from "@/components/cluster/estimated-operational-runway";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useClusterRunway } from "@/hooks/cluster/use-cluster-runway";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { Divider } from "@/components/ui/divider";
import { isBigIntChanged } from "@/lib/utils/bigint";
import { useClusterBalance } from "@/hooks/cluster/use-cluster-balance";
import { formatSSV } from "@/lib/utils/number";
import { Checkbox } from "@/components/ui/checkbox";
import { useWithdrawClusterBalance } from "@/hooks/cluster/use-withdraw-cluster-balance";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { queryClient } from "@/lib/react-query";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  value: z.bigint().positive(),
});

export const WithdrawClusterBalance: FC = () => {
  const params = useClusterPageParams();
  const withdraw = useWithdrawClusterBalance(params.clusterHash!);
  const clusterBalance = useClusterBalance(params.clusterHash!);
  const navigate = useNavigate();

  const [hasAgreed, setHasAgreed] = useState(false);

  const form = useForm({
    defaultValues: { value: 0n },
    resolver: zodResolver(schema),
  });

  const value = form.watch("value");

  const clusterRunway = useClusterRunway(params.clusterHash!, {
    deltaBalance: -value,
  });

  const isChanged = isBigIntChanged(0n, value);
  const isLiquidating = clusterRunway.runway === 0n;

  const showRiskCheckbox = isChanged && clusterRunway.isAtRisk;
  const disabled = showRiskCheckbox ? !hasAgreed : false;

  const submit = form.handleSubmit(async (params) => {
    withdraw.write(
      {
        amount: params.value,
      },
      withTransactionModal({
        onMined: async () => {
          queryClient.invalidateQueries({ queryKey: clusterBalance.queryKey });
          await clusterBalance.refetch();
          navigate(".."); // Navigate back after the transaction is mined
        },
      }),
    );
  });

  return (
    <Container variant="vertical" className="py-6">
      <NavigateBackBtn />
      <Card className="w-full gap-2">
        <Text variant="headline4" className="text-gray-500">
          Available Balance
        </Text>
        <Text variant="headline1">
          {formatSSV(clusterBalance.data ?? 0n)} SSV
        </Text>
      </Card>
      <Form {...form}>
        <Card as="form" className="w-full" onSubmit={submit}>
          <Text variant="headline4" className="text-gray-500">
            Withdraw
          </Text>
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <NumberInput
                    placeholder="0.0"
                    value={field.value}
                    onChange={field.onChange}
                    rightSlot={
                      <div className="flex items-center gap-2 px-2">
                        <Button
                          variant="secondary"
                          className="px-5"
                          size="sm"
                          onClick={() => {
                            form.setValue("value", clusterBalance.data ?? 0n, {
                              shouldValidate: true,
                            });
                          }}
                        >
                          Max
                        </Button>
                        <Text variant="headline2">SSV</Text>
                      </div>
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Divider />
          <EstimatedOperationalRunway deltaBalance={-value} />
          <Divider />

          {showRiskCheckbox && (
            <label className="flex items-center gap-2" id="understand">
              <Checkbox
                checked={hasAgreed}
                id="understand"
                className="border border-gray-500"
                onCheckedChange={(checked) => setHasAgreed(checked as boolean)}
              />
              <Text variant="body-2-semibold">
                {isLiquidating
                  ? "I understand that withdrawing this amount will liquidate my cluster."
                  : "I understand the risks of having my cluster liquidated."}
              </Text>
            </label>
          )}
          <Button
            type="submit"
            size="xl"
            disabled={!isChanged || disabled}
            isLoading={withdraw.isPending}
            variant={isLiquidating ? "destructive" : "default"}
          >
            {isLiquidating ? "Liquidate" : "Withdraw"}
          </Button>
        </Card>
      </Form>
    </Container>
  );
};

WithdrawClusterBalance.displayName = "WithdrawClusterBalance";
