import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { NumberInput } from "@/components/ui/number-input";
import { Button } from "@/components/ui/button";
import { useGetOperatorFeeIncreaseLimit } from "@/lib/contract-interactions/read/use-get-operator-fee-increase-limit";
import { useGetMaximumOperatorFee } from "@/lib/contract-interactions/read/use-get-maximum-operator-fee";
import { useOperator } from "@/hooks/use-operator";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getYearlyFee } from "@/lib/utils/operator";
export const UpdateFee: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const { data: operator } = useOperator();
  const increaseLimit = useGetOperatorFeeIncreaseLimit();
  const maxOperatorFee = useGetMaximumOperatorFee();

  const isLoading = increaseLimit.isLoading || maxOperatorFee.isLoading;

  const operatorYearlyFee = getYearlyFee(BigInt(operator?.fee ?? 0));
  console.log("operatorYearlyFee:", operatorYearlyFee);
  const max = getYearlyFee(
    BigInt(operator?.fee ?? 0) * (increaseLimit.data ?? BigInt(0)),
  );
  console.log("max:", max);

  const schema = z.object({
    fee: z
      .bigint()
      .min(operator?.is_private ? 0n : max)
      .max(maxOperatorFee.data ?? BigInt(0)),
  });

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      fee: operatorYearlyFee,
    },
    resolver: zodResolver(schema),
  });

  return (
    <Container className={cn(className)} {...props}>
      <Form {...form}>
        <Card as="form" onSubmit={form.handleSubmit(console.log)}>
          <Text variant="headline4">Update Fee</Text>
          <Text variant="body-2-medium">
            Enter your new operator annual fee.
          </Text>
          <FormField
            control={form.control}
            name="fee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual fee</FormLabel>
                <FormControl>
                  <NumberInput placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" isLoading={isLoading}>
            Next
          </Button>
        </Card>
      </Form>
    </Container>
  );
};

UpdateFee.displayName = "UpdateFee";
