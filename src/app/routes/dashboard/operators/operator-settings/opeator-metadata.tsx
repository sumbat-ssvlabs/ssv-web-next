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
import { Input, inputVariants } from "@/components/ui/input";
import { FancyMultiSelect } from "@/components/ui/multi-select";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { Tooltip } from "@/components/ui/tooltip";
import { useOperatorLocations } from "@/hooks/operator/use-operator-locations";
import { useOperatorNodes } from "@/hooks/operator/use-operator-nodes";
import { useOperator } from "@/hooks/use-operator";
import {
  MEV_RELAY_OPTIONS,
  type OperatorMetadataFields,
} from "@/lib/utils/operator";
import { cn } from "@/lib/utils/tw";
import { operatorLogoSchema } from "@/lib/zod/operator";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ComponentPropsWithoutRef, FC } from "react";
import { useForm } from "react-hook-form";
import { FaCircleInfo } from "react-icons/fa6";
import { z } from "zod";

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
  mev_relays: z.array(sanitizedString).transform((val) => val.join(", ")),
  setup_provider: sanitizedString.optional(),
  twitter_url: sanitizedString.optional(),
  website_url: sanitizedString.optional(),
}) satisfies z.ZodObject<Record<OperatorMetadataFields, z.ZodTypeAny>>;

export const OperatorMetadata: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const { data: operator } = useOperator();
  const form = useForm<z.infer<typeof schema> & { mev_relays: string[] }>({
    defaultValues: {
      ...operator,
      mev_relays: operator?.mev_relays?.split(",").filter(Boolean) ?? [],
    },
    resolver: zodResolver(schema),
  });

  const { data: operatorLocations } = useOperatorLocations();
  const { data: eth1NodeClientOptions } = useOperatorNodes(1);
  const { data: eth2NodeClientOptions } = useOperatorNodes(2);

  return (
    <Container variant="vertical" className={cn(className)} {...props}>
      <NavigateBackBtn />
      <Form {...form}>
        <Card
          as="form"
          className="w-full"
          onSubmit={form.handleSubmit((vals) => console.log("submit", vals))}
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
          {/* <FormField
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
          /> */}
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
          <FormField
            control={form.control}
            name="setup_provider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cloud Provider</FormLabel>
                <FormControl>
                  <Input placeholder="AWS, Azure, Google Cloud..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mev_relays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <FancyMultiSelect
                    selected={field.value}
                    onChange={field.onChange}
                    options={MEV_RELAY_OPTIONS}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Server Geolocation</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger
                      className={inputVariants({ className: "text-base" })}
                    >
                      <SelectValue placeholder="Select your server geolocation" />
                    </SelectTrigger>
                    <SelectContent className="font">
                      {operatorLocations?.map((country) => (
                        <SelectItem
                          key={country["iso_3166-2"]}
                          value={country.name}
                        >
                          {country.name} ({country["alpha-3"]})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="eth1_node_client"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Execution Client</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger
                      className={inputVariants({ className: "text-base" })}
                    >
                      <SelectValue placeholder="Geth, Nethermind, Besu..." />
                    </SelectTrigger>
                    <SelectContent className="font">
                      {eth1NodeClientOptions?.map((node) => (
                        <SelectItem key={node} value={node}>
                          {node}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eth2_node_client"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consensus Client</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger
                      className={inputVariants({ className: "text-base" })}
                    >
                      <SelectValue placeholder="Prism, Lighthouse, Teku..." />
                    </SelectTrigger>
                    <SelectContent className="font">
                      {eth2NodeClientOptions?.map((node) => (
                        <SelectItem key={node} value={node}>
                          {node}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website Link</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your Website Link" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="twitter_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your Twitter Link" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedin_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Linkedin</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your Linkedin Link" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dkg_address"
            render={({ field }) => (
              <FormItem>
                <Tooltip
                  content={`The IP address or domain name of the machine running the operator DKG client, along with the port number ("3030" is the default port). Example: "http://192.168.1.1:3030 or "http://my.example.com:3030"`}
                >
                  <FormLabel className="flex gap-2 items-center">
                    <Text>DKG Endpoint</Text>
                    <FaCircleInfo className="size-4 text-gray-500" />
                  </FormLabel>
                </Tooltip>
                <FormControl>
                  <Input placeholder="Enter your Website Link" {...field} />
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
