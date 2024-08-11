import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { isAddress } from "viem";
import { useAccount } from "wagmi";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Divider } from "@/components/ui/divider";
import { Badge } from "@/components/ui/badge";

const schema = z.object({
  owner: z.string().trim().refine(isAddress).readonly(),
  publicKey: z.string().min(1),
});

export const RegisterOperator: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const { address } = useAccount();

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      owner: address,
      publicKey: "",
    },
    resolver: zodResolver(schema),
  });

  const submit = form.handleSubmit((values) => {
    console.log(values);
  });

  return (
    <Container>
      <Form {...form}>
        <Card as="form" onSubmit={submit} className={cn(className)} {...props}>
          <Text variant="headline4">Register Operator</Text>
          <Text>
            Register to the networks registry to enable others to discover and
            select you as one of their validator's operators.
          </Text>

          <FormField
            control={form.control}
            name="owner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner Address</FormLabel>
                <FormControl>
                  <Input disabled className="bg-gray-300" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="publicKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Operator Public Key</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Divider />
          <div className="flex justify-between items-center">
            .flex.gap-2.items-center
            <Badge variant="success">0.1 ETH</Badge>
          </div>
          <Button size="xl" type="submit">
            Register Operator
          </Button>
        </Card>
      </Form>
    </Container>
  );
};

RegisterOperator.displayName = "RegisterOperator";
