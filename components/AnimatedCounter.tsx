'use client'

import { useEffect, useState } from 'react'
import { animate } from 'framer-motion'

export function AnimatedCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    // Immediate return for tests
    if (process.env.NODE_ENV === 'test' || process.env.NEXT_PUBLIC_CI === 'true') {
      setDisplayValue(value)
      return
    }

    // Reset to 0 when value changes or component mounts
    setDisplayValue(0)

    const controls = animate(0, value, {
      duration: 1.5,
      delay: 0.2,
      ease: [0.33, 1, 0.68, 1],
      onUpdate: (latest) => setDisplayValue(Math.round(latest))
    })

    return () => controls.stop()
  }, [value])

  return <span>{displayValue}</span>
}