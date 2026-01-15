import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Design Tokens', () => {
  it('globals.css should contain the sophisticated dark-grey palette', () => {
    const globalsCss = fs.readFileSync(path.resolve(__dirname, '../app/globals.css'), 'utf-8')
    // Check for #121212 or its OKLCH equivalent
    expect(globalsCss).toContain('--background: #121212')
    expect(globalsCss).toContain('--card: #1E1E1E')
  })

  it('globals.css should contain Concept Blue', () => {
    const globalsCss = fs.readFileSync(path.resolve(__dirname, '../app/globals.css'), 'utf-8')
    expect(globalsCss).toContain('--primary: #0057FF')
  })

  it('globals.css should have glassmorphism utilities', () => {
    const globalsCss = fs.readFileSync(path.resolve(__dirname, '../app/globals.css'), 'utf-8')
    expect(globalsCss).toContain('.glass')
  })
})
