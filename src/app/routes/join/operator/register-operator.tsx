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
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { getOperatorByPublicKeyQueryOptions } from "@/hooks/operator/get-get-operator-by-public-key";
import { FaCircleInfo } from "react-icons/fa6";
import { Tooltip } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { OperatorStatusBadge } from "@/components/operator/operator-permission/operator-status-badge";
import { useRegisterOperatorState } from "@/context/create-operator-context";
import { useNavigate } from "react-router";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";

export const RegisterOperator: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const navigate = useNavigate();
  const { address } = useAccount();

  const fetchOperatorByPublicKey = useMutation({
    mutationFn: (publicKey: string) =>
      queryClient.fetchQuery(getOperatorByPublicKeyQueryOptions(publicKey)),
  });

  const schema = z.object({
    owner: z.string().trim().refine(isAddress).readonly(),
    isPrivate: z.boolean().optional().default(false),
    publicKey: z
      .string()
      .trim()
      .superRefine(async (v, ctx) => {
        if (!/^[A-Za-z0-9]{612}$/.test(v))
          return ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid public key",
          });

        const { data } = await fetchOperatorByPublicKey.mutateAsync(v);
        if (data) {
          return ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Operator already registered",
          });
        }
      }),
  });

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      owner: address,
      publicKey: useRegisterOperatorState.state.publicKey,
      isPrivate: useRegisterOperatorState.state.isPrivate,
    },
    resolver: zodResolver(schema),
  });

  const submit = form.handleSubmit((values) => {
    useRegisterOperatorState.state.isPrivate = values.isPrivate;
    useRegisterOperatorState.state.publicKey = values.publicKey;
    navigate("../fee");
  });

  return (
    <Container variant="vertical">
      <NavigateBackBtn by="history" />
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
                  <Input
                    {...field}
                    isLoading={fetchOperatorByPublicKey.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Divider />
          <div className="flex justify-between items-center">
            <Tooltip
              content={
                <Text>
                  The amount of ETH that will be used to stake for the operator
                  registration. This amount will be locked in the operator's
                  contract and will be used to cover the operator's expenses.
                </Text>
              }
            >
              <div className="flex gap-2 items-center">
                <Text variant="headline2">Operator Status</Text>
                <FaCircleInfo className="size-4 text-gray-500" />
              </div>
            </Tooltip>
            <FormField
              control={form.control}
              name="isPrivate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <OperatorStatusBadge
                        isPrivate={form.watch("isPrivate")}
                      />
                      <Switch
                        checked={form.watch("isPrivate")}
                        id="airplane-mode"
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
