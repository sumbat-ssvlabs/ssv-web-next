import { cn } from "@/lib/utils/tw";
import React from "react";

export type TableProps = React.HTMLAttributes<HTMLDivElement> & {
  gridTemplateColumns: string;
};

const Table = React.forwardRef<HTMLDivElement, TableProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex flex-col border border-gray-300 bg-gray-50 rounded-lg overflow-auto",
        className,
      )}
      style={{
        // @ts-expect-error - Typescript doesn't support css variables
        "--parent-table-columns": props.gridTemplateColumns,
      }}
      {...props}
    />
  ),
);

const TableHeader = React.forwardRef<
  HTMLDivElement,
  React.ThHTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "_row grid w-full text-xs text-gray-600 font-semibold p-4 py-2 text-left align-middle [&:has([role=checkbox])]:pr-0 border-b border-gray-300",
      className,
    )}
    style={{
      ...style,
      gridTemplateColumns: "var(--parent-table-columns)",
    }}
    {...props}
  />
));

const TableRow = React.forwardRef<
  HTMLDivElement,
  React.ThHTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "_row grid w-full p-4 text-left align-middle font-semibold [&:has([role=checkbox])]:pr-0 hover:bg-gray-300 border-b border-gray-300",
      className,
    )}
    style={{
      ...style,
      gridTemplateColumns: "var(--parent-table-columns)",
    }}
    {...props}
  />
));

const TableCell = React.forwardRef<
  HTMLDivElement,
  React.ThHTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("block p-1 overflow-hidden", className)}
    {...props}
  />
));

export { Table, TableHeader, TableRow, TableCell };
