import type { InputProps } from "@/components/ui/input";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import { formatSSV } from "@/lib/utils/number";
import { cn } from "@/lib/utils/tw";
import { type FC, forwardRef, useRef, useState } from "react";
import { useDebounce, useKey } from "react-use";
import { parseUnits } from "viem";

export type NumberInputProps = {
  value: bigint;
  max?: bigint;
  allowNegative?: boolean;
  onChange: (value: bigint) => void;
  decimals?: number;
  maxDecimals?: number;
};

type Props = Omit<InputProps, keyof NumberInputProps> & NumberInputProps;
type NumberInputFC = FC<Props>;

const ignoreKeys = ["ArrowUp", "ArrowDown"];
const step = "0.1";

const format = (value: bigint, decimals: number) => {
  return formatSSV(value, decimals);
};

export const NumberInput: NumberInputFC = forwardRef<HTMLInputElement, Props>(
  (
    {
      value,
      max,
      className,
      decimals = 18,
      allowNegative,
      onChange,
      maxDecimals = 4,
      ...props
    },
    ref,
  ) => {
    const numReg = new RegExp(`^(-?(\\d+)?)?(\\.\\d{0,${maxDecimals}})?$`);
    const captureReg = new RegExp(`^(-?(\\d+)?)?(\\.\\d{0,${maxDecimals}})?`);

    const isTriggeredByEvent = useRef(false);
    const prev = useRef(value);
    const [displayValue, setDisplayValue] = useState(format(value, decimals));

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
        setDisplayValue(format(value, decimals));
      }, 0);
    }
    isTriggeredByEvent.current = false;
    prev.current = value;

    useKey(
      "ArrowUp",
      (event) => {
        const stepp = +step * (event.shiftKey ? 10 : 1);
        const next = value + parseUnits(stepp.toString(), decimals);
        if (max && next > max) return onChange(max);
        onChange(next);
      },
      undefined,
      [value],
    );

    useKey(
      "ArrowDown",
      (event) => {
        const stepp = +step * (event.shiftKey ? 10 : 1);
        const parsed = parseUnits(stepp.toString(), decimals);
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
          ref={ref}
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
  },
);

NumberInput.displayName = "NumberInput";
