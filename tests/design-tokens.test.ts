import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Design Tokens', () => {
  it('globals.css should contain the Sophisticated Studio palette with variables', () => {
    const globalsCss = fs.readFileSync(path.resolve(__dirname, '../app/globals.css'), 'utf-8')
    // Check for variables
    expect(globalsCss).toContain('--background: #F1F5F9')
    expect(globalsCss).toContain('--background: #020617') // dark mode
  })

  it('globals.css should contain Concept Blue primary color', () => {
    const globalsCss = fs.readFileSync(path.resolve(__dirname, '../app/globals.css'), 'utf-8')
    expect(globalsCss).toContain('--color-primary: #0057FF')
  })

  it('globals.css should have studio-card utilities', () => {
    const globalsCss = fs.readFileSync(path.resolve(__dirname, '../app/globals.css'), 'utf-8')
    expect(globalsCss).toContain('.studio-card')
    expect(globalsCss).toContain('background-color: var(--card)')
  })
})