import type { ReactNode } from 'react'
import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react'

const ease = [0.22, 1, 0.36, 1] as const

export function FadeIn({
  children,
  delay = 0,
  className,
  ...props
}: {
  children: ReactNode
  delay?: number
} & HTMLMotionProps<'div'>) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduce ? { duration: 0 } : { duration: 0.22, delay, ease }
      }
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function MotionRow({
  children,
  index = 0,
  className,
  onClick,
}: {
  children: ReactNode
  index?: number
  className?: string
  onClick?: () => void
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduce
          ? { duration: 0 }
          : { duration: 0.2, delay: index * 0.03, ease }
      }
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
