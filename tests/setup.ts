import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock IntersectionObserver
class IntersectionObserverMock {
  readonly root: Element | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []
  
  disconnect = vi.fn()
  observe = vi.fn()
  takeRecords = vi.fn()
  unobserve = vi.fn()
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)

// Mock ResizeObserver
class ResizeObserverMock {
  disconnect = vi.fn()
  observe = vi.fn()
  unobserve = vi.fn()
}

vi.stubGlobal('ResizeObserver', ResizeObserverMock)

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn()
