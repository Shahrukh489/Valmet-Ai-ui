module.exports = {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))',
  				hover: 'hsl(var(--primary-hover))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			success: {
  				DEFAULT: 'hsl(var(--success))',
  				foreground: 'hsl(var(--success-foreground))'
  			},
  			warning: {
  				DEFAULT: 'hsl(var(--warning))',
  				foreground: 'hsl(var(--warning-foreground))'
  			},
  			info: {
  				DEFAULT: 'hsl(var(--info))',
  				foreground: 'hsl(var(--info-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			surface: {
  				primary: 'hsl(var(--surface-primary))',
  				secondary: 'hsl(var(--surface-secondary))',
  				tertiary: 'hsl(var(--surface-tertiary))',
  				elevated: 'hsl(var(--surface-elevated))'
  			},
  			nav: {
  				background: 'hsl(var(--nav-background))',
  				border: 'hsl(var(--nav-border))',
  				hover: 'hsl(var(--nav-hover))'
  			},
  			sidebar: {
  				background: 'hsl(var(--sidebar-background))',
  				border: 'hsl(var(--sidebar-border))',
  				hover: 'hsl(var(--sidebar-hover))'
  			}
  		},
  		spacing: {
  			'azure-xs': '0.25rem',
  			'azure-sm': '0.5rem',
  			'azure-md': '1rem',
  			'azure-lg': '1.5rem',
  			'azure-xl': '2rem',
  			'azure-2xl': '3rem',
  			'azure-3xl': '4rem'
  		},
  		gap: {
  			'azure-xs': '0.25rem',
  			'azure-sm': '0.5rem',
  			'azure-md': '1rem',
  			'azure-lg': '1.5rem',
  			'azure-xl': '2rem',
  			'azure-2xl': '3rem'
  		},
  		fontFamily: {
  			azure: [
  				'Segoe UI',
  				'Segoe UI Web (West European)',
  				'Segoe UI',
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'Roboto',
  				'Helvetica Neue',
  				'sans-serif'
  			]
  		},
  		fontSize: {
  			'azure-xs': [
  				'0.75rem',
  				{
  					lineHeight: '1rem'
  				}
  			],
  			'azure-sm': [
  				'0.875rem',
  				{
  					lineHeight: '1.25rem'
  				}
  			],
  			'azure-base': [
  				'1rem',
  				{
  					lineHeight: '1.5rem'
  				}
  			],
  			'azure-lg': [
  				'1.125rem',
  				{
  					lineHeight: '1.75rem'
  				}
  			],
  			'azure-xl': [
  				'1.25rem',
  				{
  					lineHeight: '1.75rem'
  				}
  			],
  			'azure-2xl': [
  				'1.5rem',
  				{
  					lineHeight: '2rem'
  				}
  			],
  			'azure-3xl': [
  				'1.875rem',
  				{
  					lineHeight: '2.25rem'
  				}
  			],
  			'azure-4xl': [
  				'2.25rem',
  				{
  					lineHeight: '2.5rem'
  				}
  			],
  			'azure-5xl': [
  				'3rem',
  				{
  					lineHeight: '1'
  				}
  			]
  		},
  		boxShadow: {
  			'azure-sm': 'var(--shadow-sm)',
  			'azure-md': 'var(--shadow-md)',
  			'azure-lg': 'var(--shadow-lg)',
  			'azure-xl': 'var(--shadow-xl)'
  		},
  		animation: {
  			'azure-fade-in': 'azure-fade-in 0.2s ease-in-out',
  			'azure-slide-in': 'azure-slide-in 0.3s ease-out',
  			'azure-scale-in': 'azure-scale-in 0.2s ease-out',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		keyframes: {
  			'azure-fade-in': {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			'azure-slide-in': {
  				'0%': {
  					transform: 'translateX(-100%)'
  				},
  				'100%': {
  					transform: 'translateX(0)'
  				}
  			},
  			'azure-scale-in': {
  				'0%': {
  					transform: 'scale(0.95)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				}
  			},
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
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}