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
import { useOperatorFeeLimits } from "@/hooks/operator/use-operator-fee-limits";
import { formatSSV } from "@/lib/utils/number";
import { cn } from "@/lib/utils/tw";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ComponentPropsWithoutRef, FC } from "react";
import { useForm } from "react-hook-form";
import { formatUnits } from "viem";
import { z } from "zod";

export const UpdateFee: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const { min, max, isLoading, operatorYearlyFee } = useOperatorFeeLimits();

  const schema = z.object({
    fee: z
      .bigint()
      .min(min, `Fee must be higher than ${formatUnits(min, 18)} SSV`)
      .max(max, `You can only increase your fee up to ${formatUnits(max, 18)}`),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      fee: operatorYearlyFee,
    },
  });

  const isChanged = form.watch("fee") !== operatorYearlyFee;

  return (
    <Container variant="vertical" className={cn(className)} {...props}>
      <NavigateBackBtn />
      <Form {...form}>
        <Card
          as="form"
          className="w-full"
          onSubmit={form.handleSubmit(console.log)}
        >
          <Text variant="headline4">Update Fee</Text>
          <Text variant="body-2-medium">
            Enter your new operator annual fee.
          </Text>
          <FormField
            control={form.control}
            name="fee"
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
                    placeholder="shadcn"
                    {...field}
                    rightSlot={
                      <Button
                        size="sm"
                        variant="ghost"
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

UpdateFee.displayName = "UpdateFee";
