/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(210, 20%, 98%)',
        accent: 'hsl(170, 70%, 35%)',
        danger: 'hsl(0, 80%, 50%)',
        primary: 'hsl(220, 80%, 40%)',
        surface: 'hsl(0, 0%, 100%)',
        'text-primary': 'hsl(220, 60%, 15%)',
        'text-secondary': 'hsl(220, 30%, 40%)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '12px',
        'lg': '18px',
        'xl': '24px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(220, 30%, 15%, 0.08)',
        'modal': '0 8px 24px hsla(220, 30%, 15%, 0.12)',
      },
      fontSize: {
        'caption': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'body': ['16px', { lineHeight: '28px', fontWeight: '400' }],
        'heading2': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'heading1': ['30px', { lineHeight: '36px', fontWeight: '700' }],
        'display': ['48px', { lineHeight: '48px', fontWeight: '800' }],
      },
    },
  },
  plugins: [],
}