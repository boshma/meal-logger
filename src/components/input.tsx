//src/components/input.tsx
import * as React from "react"
import { ChangeEvent } from "react";

import { cn } from "~/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  numeric?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, numeric, onChange, ...props }, ref) => {

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (numeric) {
        const isValidInput = /^$|^[0-9]*\.?[0-9]*$/.test(e.target.value);
        const isValidDecimal = /^\.\d+/.test(e.target.value);
        if (isValidInput || isValidDecimal) {
          onChange?.(e);
        }
      } else {
        onChange?.(e);
      }
    }
    
    
    
    


    return (
      <div className="relative">
        <input
          ref={ref}
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          onChange={handleChange}
          {...props}
        />
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
