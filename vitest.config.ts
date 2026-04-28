import path from 'path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
     exclude: [
      '**/node_modules/**',
      '**/tests/*.spec.ts', 
       '**/tests/**/*.spec.ts',       // exclude Playwright specs
      '**/tests/e2e/**',          // exclude e2e folder entirely
    ],
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
   resolve: {
    alias: {
    '@/app': path.resolve(__dirname, './app'),       // ← root-level app/
    '@': path.resolve(__dirname, './src'),  
      'next/navigation': path.resolve(__dirname, 'tests/__mocks__/next/navigation.ts'),
    },
  },
})

