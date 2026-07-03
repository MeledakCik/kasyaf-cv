"use client"

import { motion, type Transition, type HTMLMotionProps } from "motion/react"
import * as React from "react"

import { cn } from "@/lib/utils"

interface Ripple {
  id: number
  x: number
  y: number
}

export interface RippleButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  children?: React.ReactNode
  scale?: number
  transition?: Transition
  rippleColor?: string
}

export const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  (
    {
      children,
      className,
      scale = 10,
      transition = { duration: 0.6, ease: "easeOut" },
      rippleColor = "bg-white/30",
      onClick,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = React.useState<Ripple[]>([])

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      const rect = event.currentTarget.getBoundingClientRect()
      const id = Date.now()
      setRipples((prev) => [
        ...prev,
        { id, x: event.clientX - rect.left, y: event.clientY - rect.top },
      ])
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id))
      }, 600)
      onClick?.(event)
    }

    return (
      <motion.button
        ref={ref}
        data-slot="ripple-button"
        onClick={handleClick}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        {children}
        {ripples.map((ripple) => (
          <motion.span
            aria-hidden
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale, opacity: 0 }}
            transition={transition}
            className={cn("pointer-events-none absolute size-5 rounded-full", rippleColor)}
            style={{ top: ripple.y - 10, left: ripple.x - 10 }}
          />
        ))}
      </motion.button>
    )
  }
)

RippleButton.displayName = "RippleButton"

export default RippleButton