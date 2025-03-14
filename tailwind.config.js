/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from "tailwindcss-animate";
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			'orange-light': 'hsl(38, 100%, 85%)',
  			'orange-dark': 'hsl(38, 100%, 55%)',
  			'cbg-dark': 'hsl(0, 0%, 7%)',
  			'cbg-darkaccent': 'hsl(0, 0%, 12%)',
  			'cfont-dark': 'hsl(60 9.1% 97.8%)',
  			'gradient-darkstart': 'hsl(30 90% 60%)',
  			'gradient-darkend': 'hsl(10 70% 30%)',
  			'welcome-dark': 'hsl(30 60% 80%)',
  			'header-dark': 'hsl(0 0% 5%)'
  		},
  		screens: {
  			'galaxy-fold': {
  				max: '320px'
  			}
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
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [tailwindcssAnimate],
};
