import type { FC } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { SelectionCard } from "@/components/ui/selection-card";
import Cmd from "@/assets/images/cmd.svg?react";
import Dkg from "@/assets/images/dkg.svg?react";
import { useState } from "react";

export const DistributeOffline: FC = () => {
  const [selectedOption, setSelectedOption] = useState<
    "existing" | "new" | null
  >(null);

  return (
    <Container size="lg" variant="vertical">
      <Card className="w-full">
        <Text variant="headline4">
          How do you want to generate your keyshares?
        </Text>
        <div className="flex gap-6">
          <SelectionCard
            icon={<Cmd />}
            title="Command Line Interface"
            description="Generate from Existing Key"
            selected={selectedOption === "existing"}
            onClick={() => setSelectedOption("existing")}
          />
          <SelectionCard
            icon={<Dkg />}
            title="Command Line Interface"
            description="Generate from New Key"
            selected={selectedOption === "new"}
            onClick={() => setSelectedOption("new")}
          />
        </div>
      </Card>
    </Container>
  );
};

DistributeOffline.displayName = "DistributeOffline";
