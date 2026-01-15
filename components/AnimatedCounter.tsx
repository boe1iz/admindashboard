'use client'

import { useEffect, useRef } from 'react'
import { animate, useInView, useMotionValue, useTransform, motion } from 'framer-motion'

export function AnimatedCounter({ value, duration = 2 }: { value: number, duration?: number }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView) {
      if (process.env.NODE_ENV === 'test' || process.env.NEXT_PUBLIC_CI === 'true') {
        count.set(value)
      } else {
        animate(count, value, { duration })
      }
    }
  }, [value, inView, count, duration])

  return <motion.span ref={ref}>{rounded}</motion.span>
}
