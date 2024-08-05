import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useOperator } from "@/hooks/use-operator";
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
import type { OperatorMetadataFields } from "@/lib/utils/operator";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { Container } from "@/components/ui/container";
import { zodResolver } from "@hookform/resolvers/zod";
import { operatorLogoSchema } from "@/lib/zod/operator";

const sanitizedString = z.string().regex(/^[a-zA-Z0-9_!$#’|\s]*$/, {
  message: "Only letters, numbers, and special characters are allowed.",
});

const schema = z.object({
  logo: operatorLogoSchema,
  name: sanitizedString.optional(),
  description: sanitizedString.optional(),
  dkg_address: sanitizedString.optional(),
  eth1_node_client: sanitizedString.optional(),
  eth2_node_client: sanitizedString.optional(),
  linkedin_url: sanitizedString.optional(),
  location: sanitizedString.optional(),
  mev_relays: sanitizedString.optional(),
  setup_provider: sanitizedString.optional(),
  twitter_url: sanitizedString.optional(),
  website_url: sanitizedString.optional(),
}) satisfies z.ZodObject<Record<OperatorMetadataFields, z.ZodTypeAny>>;

export const OperatorMetadata: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const { data: operator } = useOperator();
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      ...operator,
      logo: undefined,
    },
    resolver: zodResolver(schema),
  });

  const logoRef = form.register("logo");

  return (
    <Container variant="vertical" className={cn(className)} {...props}>
      <NavigateBackBtn />
      <Form {...form}>
        <Card
          as="form"
          className="w-full"
          onSubmit={form.handleSubmit((vals) => console.log(vals))}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Operator Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    placeholder="shadcn"
                    {...logoRef}
                    onChange={(event) => {
                      field.onChange(event.target?.files ?? undefined);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </Card>
      </Form>
    </Container>
  );
};

OperatorMetadata.displayName = "OperatorMetadata";
