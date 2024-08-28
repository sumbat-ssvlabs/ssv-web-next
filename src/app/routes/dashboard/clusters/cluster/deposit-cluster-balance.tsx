import { type FC } from "react";
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
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { Divider } from "@/components/ui/divider";
import { isBigIntChanged } from "@/lib/utils/bigint";
import { useClusterBalance } from "@/hooks/cluster/use-cluster-balance";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { queryClient } from "@/lib/react-query";
import { useDepositClusterBalance } from "@/hooks/cluster/use-deposit-cluster-balance";
import { useNavigate } from "react-router-dom";
import { useSSVBalance } from "@/hooks/use-ssv-balance";
import { formatSSV } from "@/lib/utils/number";
import { getClusterQueryOptions } from "@/hooks/cluster/use-cluster";
import { WithAllowance } from "@/components/with-allowance/with-allowance";

const schema = z.object({
  value: z.bigint().positive(),
});

export const DepositClusterBalance: FC = () => {
  const params = useClusterPageParams();
  const deposit = useDepositClusterBalance(params.clusterHash!);
  const clusterBalance = useClusterBalance(params.clusterHash!);
  const navigate = useNavigate();

  const { data: ssvBalance } = useSSVBalance();

  const form = useForm({
    defaultValues: { value: 0n },
    resolver: zodResolver(schema),
  });

  const value = form.watch("value") ?? 0n;
  const isChanged = isBigIntChanged(0n, value);

  const submit = form.handleSubmit(async (args) => {
    deposit.write(
      { amount: args.value },
      withTransactionModal({
        onMined: async () => {
          await queryClient.refetchQueries(
            getClusterQueryOptions(params.clusterHash!),
          );
          await clusterBalance.refetch();
          return () => navigate("..");
        },
      }),
    );
  });

  return (
    <Container variant="vertical" className="py-6">
      <NavigateBackBtn />
      <Form {...form}>
        <Card as="form" className="w-full" onSubmit={submit}>
          <Text variant="headline4" className="text-gray-500">
            Deposit
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
                    max={ssvBalance?.value}
                    className="h-20"
                    rightSlot={
                      <div className="flex flex-col items-end gap-1 px-2">
                        <div className="flex items-center gap-2 ">
                          <Button
                            variant="secondary"
                            className="px-2 py-0 h-6"
                            onClick={() =>
                              form.setValue("value", ssvBalance?.value ?? 0n, {
                                shouldValidate: true,
                              })
                            }
                          >
                            Max
                          </Button>
                          <Text variant="headline2">SSV</Text>
                        </div>
                        <Text variant="body-3-medium" className="text-gray-500">
                          Balance: {formatSSV(ssvBalance?.value ?? 0n)} SSV
                        </Text>
                      </div>
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Divider />
          <EstimatedOperationalRunway deltaBalance={value} />
          <Divider />
          <WithAllowance
            size="xl"
            amount={isChanged ? clusterBalance.data ?? 0n + value : 0n}
          >
            <Button
              type="submit"
              size="xl"
              disabled={!isChanged}
              isLoading={deposit.isPending}
            >
              Deposit
            </Button>
          </WithAllowance>
        </Card>
      </Form>
    </Container>
  );
};

DepositClusterBalance.displayName = "DepositClusterBalance";
