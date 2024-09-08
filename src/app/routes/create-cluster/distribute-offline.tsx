import type { FC } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { SelectionCard } from "@/components/ui/selection-card";
import Cmd from "@/assets/images/cmd.svg?react";
import Dkg from "@/assets/images/dkg.svg?react";
import { useSelectedOperatorIds } from "@/guard/register-validator-guard";
import { useOperatorsDKGHealth } from "@/hooks/operator/use-operator-dkg-health";
import { useOperators } from "@/hooks/operator/use-operators";
import { UnhealthyOperatorsList } from "@/components/offline-generation/unhealthy-operators-list";
import { Button } from "@/components/ui/button";
import type { To } from "react-router-dom";
import { Link } from "react-router-dom";
import { DockerInstructions } from "@/components/offline-generation/docker-instructions";
import { SSVKeysInstructions } from "@/components/offline-generation/ssv-keys-instructions";
import { useSearchParams } from "react-router-dom";

export const DistributeOffline: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedOption = searchParams.get("option") as
    | "existing"
    | "new"
    | null;

  const setSelectedOption = (option: "existing" | "new" | null) => {
    if (option) {
      setSearchParams({ option });
    } else {
      searchParams.delete("option");
      setSearchParams(searchParams);
    }
  };

  const isNew = selectedOption === "new";

  const selectedOperators = useSelectedOperatorIds();
  const operators = useOperators(selectedOperators);
  const health = useOperatorsDKGHealth(operators.data ?? [], {
    enabled: selectedOption === "new",
  });

  const hasUnhealthyOperators =
    isNew && health.data?.some(({ isHealthy }) => !isHealthy);

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
            isLoading={health.isLoading}
          />
        </div>
        {selectedOption === "new" && hasUnhealthyOperators && (
          <>
            <UnhealthyOperatorsList
              operators={operators.data ?? []}
              health={health.data ?? []}
            />
            <Button as={Link} to={-2 as To} size="xl" className="w-full">
              Change Operators
            </Button>
          </>
        )}
        {selectedOption === "new" &&
          !hasUnhealthyOperators &&
          health.isSuccess && (
            <DockerInstructions operators={operators.data ?? []} />
          )}
        {selectedOption === "existing" && (
          <SSVKeysInstructions operators={operators.data ?? []} />
        )}
      </Card>
    </Container>
  );
};

DistributeOffline.displayName = "DistributeOffline";
