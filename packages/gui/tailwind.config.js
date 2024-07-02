import path from 'node:path'

/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'tw-',
  content: [
    './src/**/*.{ts,tsx,html,js}',
    path.join(
      path.dirname(require.resolve('@migptgui/options')),
      '**/*.{ts,tsx,html,js}',
    ),
  ],
  important: true,
  theme: {
    extend: {},
  },
  plugins: [],
}
