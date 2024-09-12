import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { NumberInput } from "@/components/ui/number-input";
import { Text } from "@/components/ui/text";
import { useUpdateOperatorFeeContext } from "@/guard/register-operator-guards";
import { useOperatorFeeLimits } from "@/hooks/operator/use-operator-fee-limits";
import { useOperatorDeclaredFee } from "@/hooks/operator/use-operator-fee-periods";
import { useOperatorPageParams } from "@/hooks/operator/use-operator-page-params";
import { isBigIntChanged } from "@/lib/utils/bigint";
import { formatSSV } from "@/lib/utils/number";
import { cn } from "@/lib/utils/tw";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ComponentPropsWithoutRef, FC } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { formatUnits } from "viem";
import { z } from "zod";

export const UpdateOperatorFee: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const { operatorId } = useOperatorPageParams();
  const navigate = useNavigate();
  const { min, max, isLoading, operatorYearlyFee } = useOperatorFeeLimits();

  const schema = z.object({
    yearlyFee: z
      .bigint()
      .min(min, `Fee must be higher than ${formatUnits(min, 18)} SSV`)
      .max(max, `You can only increase your fee up to ${formatUnits(max, 18)}`),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      yearlyFee: operatorYearlyFee,
    },
  });

  const declaredOperatorFee = useOperatorDeclaredFee(BigInt(operatorId!));

  const submit = form.handleSubmit((values) => {
    useUpdateOperatorFeeContext.state.previousYearlyFee = operatorYearlyFee;
    useUpdateOperatorFeeContext.state.newYearlyFee = values.yearlyFee;

    const isIncreased = values.yearlyFee > operatorYearlyFee;
    declaredOperatorFee.reset();
    return navigate(isIncreased ? "../increase" : "../decrease");
  });

  const isChanged = isBigIntChanged(form.watch("yearlyFee"), operatorYearlyFee);

  return (
    <Container variant="vertical" className={cn(className, "py-6")} {...props}>
      <NavigateBackBtn by="path" to="../.." />
      <Form {...form}>
        <Card as="form" className="w-full" onSubmit={submit}>
          <Text variant="headline4">Update Fee</Text>
          <Text variant="body-2-medium">
            Enter your new operator annual fee.
          </Text>
          <FormField
            control={form.control}
            name="yearlyFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex w-full justify-between gap-2">
                  <Text>Annual fee</Text>
                  <Text className="text-gray-500" variant="caption-bold">
                    Max: {formatSSV(max)}
                  </Text>
                </FormLabel>
                <FormControl>
                  <NumberInput
                    max={max}
                    placeholder=""
                    {...field}
                    className="pr-1.5"
                    rightSlot={
                      <Button
                        size="sm"
                        variant="subtle"
                        className="text-xs font-bold"
                        onClick={() => field.onChange(max)}
                      >
                        Max
                      </Button>
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            size="xl"
            type="submit"
            isLoading={isLoading}
            disabled={!isChanged}
          >
            Next
          </Button>
        </Card>
      </Form>
    </Container>
  );
};

UpdateOperatorFee.displayName = "UpdateOperatorFee";
