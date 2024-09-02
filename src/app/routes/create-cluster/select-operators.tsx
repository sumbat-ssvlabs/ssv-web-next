import { OperatorClusterSizePicker } from "@/components/operator/operator-picker/operator-cluster-size-picker";
import { OperatorPicker } from "@/components/operator/operator-picker/operator-picker";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils/tw";
import { xor } from "lodash-es";
import { type ComponentPropsWithoutRef, type FC } from "react";
import { Link } from "react-router-dom";
import { OperatorPickerFilter } from "@/components/operator/operator-picker/operator-picker-filter/operator-picker-filter";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { createClusterHash } from "@/lib/utils/cluster";
import { useAccount } from "wagmi";
import { SelectedOperators } from "@/components/operator/operator-picker/selected-operators";
import { useSearchOperators } from "@/hooks/use-search-operators";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRegisterValidatorContext } from "@/guard/register-validator-guard";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export type SelectOperatorsProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof SelectOperatorsProps> &
    SelectOperatorsProps
>;

export const SelectOperators: FCProps = ({ className, ...props }) => {
  const { address } = useAccount();
  const { state } = useRegisterValidatorContext;
  const { clusterSize, selectedOperatorsIds } = useRegisterValidatorContext();

  const search = useDebouncedValue("", 500);

  const { operators, infiniteQuery, fetched } = useSearchOperators({
    search: search.debouncedValue,
  });

  const selectedOperators = selectedOperatorsIds.map(
    (id) => fetched.operatorsMap[id],
  );

  const hasUnverifiedOperators = selectedOperators.some(
    (operator) => operator.type !== "verified_operator",
  );

  const hash = createClusterHash(address!, selectedOperatorsIds);
  const cluster = useCluster(hash, {
    enabled: selectedOperatorsIds.length === clusterSize,
  });

  const isClusterExists =
    selectedOperatorsIds.length === clusterSize &&
    cluster.isSuccess &&
    cluster.data !== null;

  return (
    <Container variant="vertical" className="h-full max-h-full py-6" size="xl">
      <NavigateBackBtn />
      <div className="flex items-stretch flex-1 gap-6 h-full w-full">
        <Card className={cn(className, "flex flex-col flex-[2]")} {...props}>
          <Text variant="headline4">
            Pick the cluster of network operators to run your validator
          </Text>
          <OperatorClusterSizePicker
            value={clusterSize}
            onChange={(size) => (state.clusterSize = size)}
          />
          <OperatorPickerFilter
            value={search.value}
            onChange={search.setValue}
          />
          <OperatorPicker
            operators={operators}
            query={infiniteQuery}
            maxSelection={clusterSize}
            selectedOperatorIds={selectedOperatorsIds}
            onOperatorCheckedChange={(id) => {
              state.selectedOperatorsIds = xor(selectedOperatorsIds, [id]);
            }}
          />
        </Card>
        <Card className="flex-[1]">
          <SelectedOperators
            className="flex-[1] overflow-auto"
            clusterSize={clusterSize}
            selectedOperators={selectedOperators}
            onRemoveOperator={({ id }) => {
              state.selectedOperatorsIds = xor(selectedOperatorsIds, [id]);
            }}
          />

          {hasUnverifiedOperators && (
            <Alert variant="warning">
              <AlertDescription className="flex flex-col gap-4">
                <Text>
                  You have selected one or more operators that are{" "}
                  <Button
                    as="a"
                    variant="link"
                    href="https://docs.ssv.network/learn/operators/verified-operators"
                  >
                    not verified
                  </Button>
                </Text>
                <Text>
                  Unverified operators that were not reviewed and their identity
                  is not confirmed, may pose a threat to your validators'
                  performance.
                </Text>
                <Text>
                  Please proceed only if you know and trust these operators.
                </Text>
              </AlertDescription>
            </Alert>
          )}
          {isClusterExists && (
            <Alert variant="error">
              <AlertDescription>
                To register an additional validator to this cluster, navigate to
                this{" "}
                <Button
                  as={Link}
                  variant="link"
                  to={`/clusters/${cluster.data?.clusterId}`}
                >
                  cluster page
                </Button>{" "}
                and click “Add Validator”.
              </AlertDescription>
            </Alert>
          )}
          <Button size="xl" as={Link} to="../distribution-method">
            Next
          </Button>
        </Card>
      </div>
    </Container>
  );
};

SelectOperators.displayName = "SelectOperators";
