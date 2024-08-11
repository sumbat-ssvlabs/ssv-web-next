import { OperatorsTable } from "@/components/operator/operators-table/operators-table";
import { Container } from "@/components/ui/container";
import { usePaginatedAccountOperators } from "@/hooks/operator/use-account-operators";
import { type ComponentPropsWithoutRef, type FC } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router";

export const Operators: FC<ComponentPropsWithoutRef<"div">> = () => {
  const accountOperators = usePaginatedAccountOperators();
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>SSV My Operators</title>
      </Helmet>

      <Container size="xl" className="h-full">
        <OperatorsTable
          className="h-full"
          operators={accountOperators.operators}
          pagination={accountOperators.pagination}
          onOperatorClick={(operator) => {
            console.log("operator:", operator);
            navigate(operator.id_str);
          }}
        />
      </Container>
    </>
  );
};

Operators.displayName = "Operators";
