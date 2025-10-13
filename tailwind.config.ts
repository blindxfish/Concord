import type { Config } from 'tailwindcss'

export default {
	content: [
		'./app/**/*.{ts,tsx}',
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./contexts/**/*.{ts,tsx}',
	],
	darkMode: 'class',
	theme: {
		extend: {},
	},
	plugins: [],
} satisfies Config


