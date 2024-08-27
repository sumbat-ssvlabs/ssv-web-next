import type { FC } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";

export const SlashingWarning: FC = () => {
  return (
    <Container variant="vertical">
      <Card>SlashingWarning</Card>
    </Container>
  );
};

SlashingWarning.displayName = "SlashingWarning";
