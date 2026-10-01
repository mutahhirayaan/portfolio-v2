/** @type {import('tailwindcss').Config} */
const c = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: c('bg'),
        elevated: c('elevated'),
        fg: c('fg'),
        muted: c('muted'),
        line: c('line'),
        primary: c('primary'),
        bright: c('bright'),
        secondary: c('secondary'),
        accent: c('accent'),
      },
      fontFamily: {
        display: ['"Bricolage Grotesque Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Manrope Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgb(var(--bright) / 0.25), 0 10px 40px -10px rgb(var(--bright) / 0.45)',
        soft: '0 20px 50px -20px rgb(var(--shadow) / 0.35)',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        spin3d: { from: { transform: 'rotateX(-24deg) rotateY(0deg)' }, to: { transform: 'rotateX(-24deg) rotateY(360deg)' } },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
        drift: { '0%,100%': { transform: 'translate3d(0,0,0)' }, '50%': { transform: 'translate3d(30px,-20px,0)' } },
        shimmer: { to: { backgroundPosition: '-200% 0' } },
      },
      animation: {
        marquee: 'marquee 45s linear infinite',
        float: 'float 6s ease-in-out infinite',
        spin3d: 'spin3d 26s linear infinite',
        spinSlow: 'spinSlow 8s linear infinite',
        drift: 'drift 14s ease-in-out infinite',
        shimmer: 'shimmer 2.2s linear infinite',
      },
    },
  },
  plugins: [],
};
