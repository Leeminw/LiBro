"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

type CustomProgressProps = React.ComponentPropsWithoutRef<
  typeof ProgressPrimitive.Root
> & {
  indicatorColor: string;
};

const ProgressY = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  CustomProgressProps
>(({ className, value, indicatorColor, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-full w-4 overflow-hidden  bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={`h-full w-full flex-1 transition-all ${indicatorColor}`}
      style={{ transform: `translateY(${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
ProgressY.displayName = ProgressPrimitive.Root.displayName;

export { ProgressY };
