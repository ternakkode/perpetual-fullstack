/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class", "class"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		colors: {
  			background: '#0a0a0a',
  			foreground: '#f5f5f5',
  			card: '#101010',
  			'card-foreground': '#f5f5f5',
  			popover: '#0a0a0a',
  			'popover-foreground': '#f5f5f5',
  			primary: {
  				DEFAULT: '#f0ff00',
  				foreground: '#101010'
  			},
  			secondary: {
  				DEFAULT: '#1f2937',
  				foreground: '#f5f5f5'
  			},
  			muted: {
  				DEFAULT: '#18181b',
  				foreground: '#a1a1aa'
  			},
  			accent: {
  				DEFAULT: '#101827',
  				foreground: '#f5f5f5'
  			},
  			destructive: {
  				DEFAULT: '#ff453a',
  				foreground: '#fafafa'
  			},
  			border: '#27272a',
  			input: '#1f2937',
  			ring: '#f0ff00',
  			chart: {
  				'1': '#d4e000',
  				'2': '#00b0ff',
  				'3': '#ff4081',
  				'4': '#ffc400',
  				'5': '#7c4dff'
  			},
  			sidebar: {
  				DEFAULT: '#101010',
  				foreground: '#a1a1aa',
  				primary: '#f0ff00',
  				'primary-foreground': '#101010',
  				accent: '#1f2937',
  				'accent-foreground': '#f5f5f5',
  				border: '#27272a',
  				ring: '#f0ff00'
  			},
  			danger: {
  				DEFAULT: '#ff453a',
  				base: '#ff453a14'
  			},
  			yellow: {
  				DEFAULT: '#f0ff00',
  				base: '#f0ff0014'
  			},
  			popup: '#101010',
  			tooltips: '#1f2937',
  			white: {
  				'4': '#f5f5f50a',
  				'8': '#f5f5f514',
  				'16': '#f5f5f529',
  				'24': '#f5f5f53d',
  				'32': '#f5f5f552',
  				'48': '#f5f5f57a',
  				'64': '#f5f5f5a3',
  				'72': '#f5f5f5b8',
  				'80': '#f5f5f5cc',
  				DEFAULT: '#f5f5f5'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-geist-sans),',
  				  				'var(--font-inter)',
  				'sans-serif'
  			],
  			serif: [
  				'serif'
  			],
  			mono: [
  				'var(--font-space-mono)',
  				'Space Mono',
  				'monospace'
  			]
  		},
  		fontSize: {
  			h1: [
  				'64px',
  				'76px'
  			],
  			h2: [
  				'56px',
  				'64px'
  			],
  			h3: [
  				'48px',
  				'60px'
  			],
  			h4: [
  				'40px',
  				'52px'
  			],
  			h5: [
  				'32px',
  				'40px'
  			],
  			h6: [
  				'24px',
  				'32px'
  			],
  			xl: [
  				'18px',
  				'28px'
  			],
  			lg: [
  				'16px',
  				'24px'
  			],
  			md: [
  				'14px',
  				'20px'
  			],
  			sm: [
  				'12px',
  				'16px'
  			],
  			xs: [
  				'11px',
  				'14px'
  			]
  		},
  		borderRadius: {
  			sm: 'calc(0.5rem - 4px)',
  			md: 'calc(0.5rem - 2px)',
  			lg: '0.5rem',
  			xl: 'calc(0.5rem + 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		letterSpacing: {
  			tighter: '-0.05em',
  			tight: '-0.025em',
  			normal: '0rem',
  			wide: '0.025em',
  			wider: '0.05em',
  			widest: '0.1em',
  			DEFAULT: '0rem'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
