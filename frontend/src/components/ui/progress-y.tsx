"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

type CustomProgressProps = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
  indicatorColor: string;
  mval: number;
  fval: number;
};

const ProgressY = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  CustomProgressProps
>(({ className, value, indicatorColor, fval, mval, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-full w-4 overflow-hidden flex flex-col justfiy-end bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={`absolute h-full w-full bg-blue-400 duration-1000 transition-all ${indicatorColor}`}
      style={{ transform: `translateY(${100 - mval - fval}%)` }}
    />
    <ProgressPrimitive.Indicator
      className={`absolute h-full w-full bg-red-400 duration-1000 transition-all ${indicatorColor}`}
      style={{ transform: `translateY(${100 - fval}%)` }}
    />
  </ProgressPrimitive.Root>
));
ProgressY.displayName = ProgressPrimitive.Root.displayName;

export { ProgressY };
