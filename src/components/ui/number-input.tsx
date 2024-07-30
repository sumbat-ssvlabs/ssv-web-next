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
  const isEmptyInput = useRef(false);
  const [displayValue, setDisplayValue] = useState(
    formatUnits(value, decimals),
  );

  useEffect(() => {
    if (isEmptyInput.current) return;
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

        if (value === "") {
          isEmptyInput.current = true;
          onChange(0n);
          return setDisplayValue("");
        }

        if (value.endsWith("0") || value.endsWith(".")) setDisplayValue(value);

        isEmptyInput.current = false;
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
