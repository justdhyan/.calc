
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Neon colors
				neon: {
					purple: '#9b87f5',
					'purple-bright': '#8B5CF6',
					orange: '#F97316',
					'orange-bright': '#FB923C',
					blue: '#0EA5E9',
					'blue-bright': '#38BDF8',
					pink: '#EC4899',
					'pink-bright': '#F472B6',
				},
				// Dark theme colors
				dark: {
					'base': '#0f0f12',
					'card': '#1A1F2C',
					'elevated': '#222222',
					'border': '#333333'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				},
				'glow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'scale-fade': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'pulse-shadow': {
					'0%, 100%': { boxShadow: '0 0 5px rgba(255,255,255,0.2)' },
					'50%': { boxShadow: '0 0 20px rgba(255,255,255,0.4)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'glow': 'glow 2s ease-in-out infinite',
				'float': 'float 6s ease-in-out infinite',
				'scale-fade': 'scale-fade 0.3s ease-out',
				'pulse-shadow': 'pulse-shadow 2s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'purple-glow': 'linear-gradient(to right, rgba(155, 135, 245, 0.2), rgba(155, 135, 245, 0))',
				'orange-glow': 'linear-gradient(to right, rgba(249, 115, 22, 0.2), rgba(249, 115, 22, 0))',
				'blue-glow': 'linear-gradient(to right, rgba(14, 165, 233, 0.2), rgba(14, 165, 233, 0))',
				'pink-glow': 'linear-gradient(to right, rgba(236, 72, 153, 0.2), rgba(236, 72, 153, 0))',
				'dark-gradient': 'linear-gradient(to bottom right, #1A1F2C, #13111C)',
				'neon-gradient-purple': 'linear-gradient(135deg, #9b87f5 0%, #8B5CF6 50%, #7E57C2 100%)',
				'neon-gradient-orange': 'linear-gradient(135deg, #F97316 0%, #FB923C 50%, #FDBA74 100%)',
				'neon-gradient-blue': 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 50%, #7DD3FC 100%)',
				'dark-gradient-deep': 'linear-gradient(to bottom right, #1A1F2C, #13111C, #0f0f12)',
				'pastel-gradient-lavender': 'linear-gradient(135deg, #E5DEFF 0%, #D3C6FF 50%, #C6B8FF 100%)',
				'pastel-gradient-mint': 'linear-gradient(135deg, #F2FCE2 0%, #DBEBC4 50%, #C6E3A1 100%)',
				'pastel-gradient-peach': 'linear-gradient(135deg, #FDE1D3 0%, #FEC6A1 50%, #FFB482 100%)'
			},
			boxShadow: {
				'neon-purple': '0 0 10px rgba(155, 135, 245, 0.5), 0 0 20px rgba(155, 135, 245, 0.3)',
				'neon-orange': '0 0 10px rgba(249, 115, 22, 0.5), 0 0 20px rgba(249, 115, 22, 0.3)',
				'neon-blue': '0 0 10px rgba(14, 165, 233, 0.5), 0 0 20px rgba(14, 165, 233, 0.3)',
				'neon-pink': '0 0 10px rgba(236, 72, 153, 0.5), 0 0 20px rgba(236, 72, 153, 0.3)',
				'neon-purple-intense': '0 0 15px rgba(155, 135, 245, 0.6), 0 0 25px rgba(155, 135, 245, 0.4)',
				'neon-orange-intense': '0 0 15px rgba(249, 115, 22, 0.6), 0 0 25px rgba(249, 115, 22, 0.4)',
				'neon-blue-intense': '0 0 15px rgba(14, 165, 233, 0.6), 0 0 25px rgba(14, 165, 233, 0.4)'
			},
			fontFamily: {
				'sans': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			},
			scale: {
				'102': '1.02',
				'98': '0.98',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
