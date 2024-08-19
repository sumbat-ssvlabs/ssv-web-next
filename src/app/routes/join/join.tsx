import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils/tw";
import { type ComponentPropsWithoutRef, type FC } from "react";

export const Join: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  return (
    <Container variant="vertical">
      <Card className={cn(className)} {...props}>
        <Text variant="headline4">Join the SSV Network Operators</Text>
        <Text>
          Distribute your validator to run on the SSV network or help maintain
          it as one of its operators.
        </Text>

        <div className="flex gap-4">
          <div className="flex-1 flex gap-2 flex-col items-center">
            <Button
              as="a"
              target="_blank"
              href="https://docs.ssv.network/operator-user-guides/operator-node/installation"
              size="xl"
              variant="secondary"
              className="w-full"
            >
              Run SSV Node
            </Button>
            <Text variant="body-3-medium" className="text-gray-500">
              Follow our installation docs
            </Text>
          </div>
          <div className="flex-1 flex gap-2 flex-col items-center">
            <Button variant="secondary" size="xl" className="w-full">
              Register Operator
            </Button>
            <Text variant="body-3-medium" className="text-gray-500">
              Sign up with your operator key
            </Text>
          </div>
        </div>
      </Card>
    </Container>
  );
};

Join.displayName = "Join";
