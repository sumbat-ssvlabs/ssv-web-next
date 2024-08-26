import type { FC } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

export const DistributionMethod: FC = () => {
  return (
    <Container variant="vertical">
      <Card className="font-medium">
        <Text variant="headline4">Generate Validator KeyShares</Text>
        <Text>
          To run a Distributed Validator you must split your validation key into{" "}
          <b>Key Shares</b> and distribute them across your selected operators
          to operate in your behalf
        </Text>
        <img src="/images/generateValidatorKeyShare/image.svg" />
        <Text>Select your preferred method to split your key:</Text>
        <div className="space-y-2">
          <div className="flex [&>*]:flex-1 gap-2">
            <Button variant="secondary" size="xl">
              Online
            </Button>
            <Button variant="secondary" size="xl">
              Offline
            </Button>
          </div>
          <Button variant="secondary" size="xl" className="w-full ">
            Offline
          </Button>
        </div>
      </Card>
    </Container>
  );
};

DistributionMethod.displayName = "DistributionMethod";
