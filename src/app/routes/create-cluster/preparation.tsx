import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { Text } from "@/components/ui/text";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";
import { BiCheck } from "react-icons/bi";
import { TbInfoSquareRoundedFilled } from "react-icons/tb";
import { Link } from "react-router-dom";

export type PreparationProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof PreparationProps> &
    PreparationProps
>;

export const Preparation: FCProps = ({ className, ...props }) => {
  return (
    <Container variant="vertical">
      <NavigateBackBtn variant="ghost" />
      <Card className={cn(className)} {...props}>
        <Text variant="headline4">Run a Distributed Validator</Text>
        <Text variant="body-2-medium" className="text-gray-700">
          Distribute your validation duties among a set of distributed nodes to
          improve your validator resilience, safety, liveliness, and diversity.
        </Text>
        <Text variant="body-2-semibold" className="text-gray-500">
          Prerequisites
        </Text>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <BiCheck className="size-5 text-green-500" />
            <Text variant="body-2-medium">
              An active Ethereum validator (deposited to Beacon Chain)
            </Text>
            <Tooltip
              content={
                <Text variant="body-2-medium">
                  Don't have a validator?{" "}
                  <Link className="link" to="/launchpad">
                    Create via Ethereum Launchpad
                  </Link>
                </Text>
              }
            >
              <TbInfoSquareRoundedFilled className="text-gray-500" />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <BiCheck className="size-5 text-green-500" />
            <Text variant="body-2-medium">
              SSV tokens to cover operational fees
            </Text>
          </div>
        </div>
        <div className="flex flex-col w-full gap-2">
          <Button as={Link} to="select-operators" size="xl">
            Generate new key shares
          </Button>
          <Button as={Link} to="generate-offline" size="xl" variant="secondary">
            I already have key shares
          </Button>
        </div>
      </Card>
    </Container>
  );
};

Preparation.displayName = "Preparation";
