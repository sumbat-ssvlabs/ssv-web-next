import { type FC, type ComponentPropsWithoutRef } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Text } from "@/components/ui/text";
import { NumberInput } from "@/components/ui/number-input";
import { parseEther } from "viem";
import { globals } from "@/config";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { useFocus } from "@/hooks/use-focus";
import { useRegisterOperatorState } from "@/guard/operator-guards";

export const SetOperatorFee: FC<ComponentPropsWithoutRef<"div">> = () => {
  const navigate = useNavigate();
  const { isPrivate } = useRegisterOperatorState();

  const schema = z.object({
    yearlyFee: z
      .bigint()
      .min(
        isPrivate
          ? 0n
          : globals.BLOCKS_PER_YEAR * globals.MINIMUM_OPERATOR_FEE_PER_BLOCK,
      )
      .max(parseEther("200")),
  });

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      yearlyFee: useRegisterOperatorState.state.yearlyFee,
    },
    resolver: zodResolver(schema),
  });

  const submit = form.handleSubmit((values) => {
    useRegisterOperatorState.state.yearlyFee = values.yearlyFee;
    navigate("../confirm-transaction");
  });

  useFocus("#register-operator-fee", { select: true });

  return (
    <Container variant="vertical">
      <NavigateBackBtn by="history" />
      <Form {...form}>
        <Card as="form" onSubmit={submit}>
          <Text variant="headline4">Register Operator</Text>
          <Text>
            Register to the networks registry to enable others to discover and
            select you as one of their validator's operators.
          </Text>

          <FormField
            control={form.control}
            name="yearlyFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fee</FormLabel>
                <FormControl>
                  <NumberInput
                    id="register-operator-fee"
                    value={field.value}
                    onChange={field.onChange}
                    max={parseEther("200")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="xl">
            Next
          </Button>
        </Card>
      </Form>
    </Container>
  );
};

SetOperatorFee.displayName = "SetOperatorFee";
