import type { FC } from "react";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { NumberInput } from "@/components/ui/number-input";
import { EstimatedOperationalRunway } from "@/components/cluster/estimated-operational-runway";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";

const schema = z.object({
  value: z.bigint().positive(),
});

export const DepositClusterBalance: FC = () => {
  const form = useForm({
    defaultValues: {
      value: 0n,
    },
    resolver: zodResolver(schema),
  });

  return (
    <Container variant="vertical" className="py-6">
      <NavigateBackBtn />
      <Form {...form}>
        <Card as="form" className="w-full">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fee Recipient Address</FormLabel>
                <FormControl>
                  <NumberInput value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <EstimatedOperationalRunway deltaBalance={form.watch("value")} />
        </Card>
      </Form>
    </Container>
  );
};

DepositClusterBalance.displayName = "DepositClusterBalance";
