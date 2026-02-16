"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface PromptInputProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onValueChange?: (value: string) => void
  onSubmit?: () => void
}

const PromptInput = React.forwardRef<HTMLDivElement, PromptInputProps>(
  ({ className, value, onValueChange, onSubmit, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full flex-col rounded-2xl bg-white p-4 transition-all duration-300 border border-black/[0.03] focus-within:ring-1 focus-within:ring-black/5",
          className
        )}
        style={{ 
          boxShadow: '0 0 0 1px rgba(0,0,0,0.02), 0 8px 30px rgba(0,0,0,0.02)' 
        }}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              value,
              onValueChange,
              onSubmit,
            })
          }
          return child;
        })}
      </div>
    )
  }
)
PromptInput.displayName = "PromptInput"

export interface PromptInputTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onValueChange?: (value: string) => void
  onSubmit?: () => void
}

const PromptInputTextarea = React.forwardRef<
  HTMLTextAreaElement,
  PromptInputTextareaProps
>(({ className, value, onValueChange, onSubmit, ...props }, ref) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSubmit?.()
    }
  }

  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full bg-transparent border-0 focus:ring-0 p-0 text-lg text-foreground placeholder:text-foreground/20 resize-none overflow-hidden min-h-[80px]",
        className
      )}
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      onKeyDown={handleKeyDown}
      {...props}
    />
  )
})
PromptInputTextarea.displayName = "PromptInputTextarea"

const PromptInputActions = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { onValueChange?: any; onSubmit?: any }) => {
  const { onValueChange, onSubmit, ...rest } = props as any;
  return <div className={cn("flex items-center justify-between mt-4", className)} {...rest} />;
}
PromptInputActions.displayName = "PromptInputActions"

export { PromptInput, PromptInputTextarea, PromptInputActions }
