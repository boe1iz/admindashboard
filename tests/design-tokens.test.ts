import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Design Tokens', () => {
  it('globals.css should contain the Sophisticated Studio palette', () => {
    const globalsCss = fs.readFileSync(path.resolve(__dirname, '../app/globals.css'), 'utf-8')
    // Check for #F1F5F9 background
    expect(globalsCss).toContain('background-color: #F1F5F9 !important')
  })

  it('globals.css should contain Concept Blue primary color', () => {
    const globalsCss = fs.readFileSync(path.resolve(__dirname, '../app/globals.css'), 'utf-8')
    expect(globalsCss).toContain('--color-primary: #0057FF')
  })

  it('globals.css should have studio-card utilities', () => {
    const globalsCss = fs.readFileSync(path.resolve(__dirname, '../app/globals.css'), 'utf-8')
    expect(globalsCss).toContain('.studio-card')
  })
})