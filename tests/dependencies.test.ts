import { describe, it, expect } from 'vitest'

describe('Dependencies', () => {
  it('has framer-motion installed', async () => {
    const motion = await import('framer-motion')
    expect(motion).toBeDefined()
  })
})
