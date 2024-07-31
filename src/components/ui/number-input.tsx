import type { InputProps } from "@/components/ui/input";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils/tw";
import { type FC, useRef, useState } from "react";
import { useDebounce, useKey } from "react-use";
import { formatUnits, parseUnits } from "viem";

export type NumberInputProps = {
  value: bigint;
  max?: bigint;
  allowNegative?: boolean;
  onChange: (value: bigint) => void;
  decimals?: number;
};

type FCProps = FC<Omit<InputProps, keyof NumberInputProps> & NumberInputProps>;

const numReg = /^(-?(\d+)?)?(\.\d{0,10})?$/;
const captureReg = /^(-?(\d+)?)?(\.\d{0,10})?/;
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
  const prev = useRef(value);
  const [displayValue, setDisplayValue] = useState(
    formatUnits(value, decimals),
  );

  const [showMaxSet, setShowMaxSet] = useState(false);
  useDebounce(
    () => {
      setShowMaxSet(false);
    },
    2500,
    [showMaxSet],
  );

  if (!isTriggeredByEvent.current && prev.current !== value) {
    setTimeout(() => {
      setDisplayValue(
        formatUnits(value, decimals).toString().match(captureReg)?.[0] || "",
      );
    }, 0);
  }
  isTriggeredByEvent.current = false;
  prev.current = value;

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
    <Tooltip
      asChild
      content={"Max value set"}
      open={showMaxSet}
      hasArrow
      side="left"
    >
      <Input
        {...props}
        value={displayValue}
        onKeyDown={(ev) => ignoreKeys.includes(ev.key) && ev.preventDefault()}
        onInput={(ev) => {
          const value = ev.currentTarget.value.match(captureReg)?.[0] || "";
          const isNumber = numReg.test(value);
          if (!isNumber) return;
          if (!allowNegative && value.includes("-")) return;

          isTriggeredByEvent.current = true;
          const parsed = parseUnits(value, decimals);

          if (max && parsed > max) {
            isTriggeredByEvent.current = false;
            setShowMaxSet(true);
            return onChange(max);
          }
          onChange(parsed);

          setDisplayValue(value);
        }}
        className={cn(className)}
        inputMode="numeric"
        type="text"
      />
    </Tooltip>
  );
};

NumberInput.displayName = "NumberInput";
