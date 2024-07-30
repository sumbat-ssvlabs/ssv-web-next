import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/tw";
import {
  type ComponentPropsWithoutRef,
  type FC,
  useEffect,
  useRef,
  useState,
} from "react";
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

const numReg = /^(-?\d+)?(\.\d*)?$/;

export const NumberInput: FCProps = ({
  value,
  max,
  className,
  decimals = 18,
  allowNegative,
  onChange,
  ...props
}) => {
  const changedType = useRef<"event" | undefined>(undefined);
  const [displayValue, setDisplayValue] = useState(
    formatUnits(value, decimals),
  );

  useEffect(() => {
    if (changedType.current === "event") {
      return (changedType.current = undefined);
    }
    setDisplayValue(formatUnits(value, decimals).toString());
  }, [value, decimals]);

  return (
    <Input
      {...props}
      value={displayValue}
      onInput={(ev) => {
        const value = ev.currentTarget.value;
        const isNumber = numReg.test(value);
        if (!isNumber) return console.log("no num");
        if (!allowNegative && value.includes("-")) return console.log("no neg");

        changedType.current = "event";
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
