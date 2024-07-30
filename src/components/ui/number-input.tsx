import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/tw";
import {
  type ComponentPropsWithoutRef,
  type FC,
  useEffect,
  useRef,
  useState,
} from "react";
import { useKey } from "react-use";
import { formatUnits, parseUnits } from "viem";

export type NumberInputProps = {
  value: bigint;
  max?: bigint;
  allowNegative?: boolean;
  onChange: (value: bigint) => void;
  decimals?: number;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"input">, keyof NumberInputProps> &
    NumberInputProps
>;

const numReg = /^(-?(0|[1-9]\d*)?)?(\.\d*)?$/;
const ignoreKeys = ["ArrowUp", "ArrowDown"];
const delta = "0.05";

export const NumberInput: FCProps = ({
  value,
  max,
  className,
  decimals = 18,
  allowNegative,
  onChange,
  ...props
}) => {
  const isTriggeredByEvent = useRef(false);
  const [displayValue, setDisplayValue] = useState(
    formatUnits(value, decimals),
  );

  useEffect(() => {
    if (isTriggeredByEvent.current) {
      isTriggeredByEvent.current = false;
      return;
    }
    setDisplayValue(formatUnits(value, decimals).toString());
  }, [value, decimals]);

  useKey(
    "ArrowUp",
    () => {
      const next = value + parseUnits(delta, decimals);
      if (max && next > max) return onChange(max);
      onChange(next);
    },
    undefined,
    [value],
  );

  useKey(
    "ArrowDown",
    () => {
      const parsed = parseUnits(delta, decimals);
      const newValue = value - parsed;
      if (newValue < 0n) return onChange(0n);
      onChange(newValue);
    },
    undefined,
    [value],
  );

  return (
    <Input
      {...props}
      value={displayValue}
      onKeyDown={(ev) => ignoreKeys.includes(ev.key) && ev.preventDefault()}
      onInput={(ev) => {
        const value = ev.currentTarget.value;
        const isNumber = numReg.test(value);
        if (!isNumber) return;
        if (!allowNegative && value.includes("-")) return;

        isTriggeredByEvent.current = true;
        setDisplayValue(value);

        const parsed = parseUnits(ev.currentTarget.value, decimals);
        if (max && parsed > max) return onChange(max);
        onChange(parsed);
      }}
      className={cn(className)}
      inputMode="numeric"
      type="text"
    />
  );
};

NumberInput.displayName = "NumberInput";
