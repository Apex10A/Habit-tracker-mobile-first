import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock next/font/google
vi.mock('next/font/google', () => ({
  Gabarito: () => ({
    variable: '--font-gabarito',
    className: 'mock-gabarito',
  }),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => '',
}));

// Mock crypto.randomUUID if not available in environment
if (!crypto.randomUUID) {
  Object.defineProperty(crypto, 'randomUUID', {
    value: () => Math.random().toString(36).substring(2) + Date.now().toString(36),
  });
}
