/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        space:    ['var(--font-space)', 'ui-sans-serif', 'system-ui'],
        orbitron: ['var(--font-orbitron)', 'ui-sans-serif'],
      },
      colors: {
        brand: { teal: '#14b8a6', cyan: '#22d3ee', glow: '#0d9488' },
      },
      backgroundImage: {
        'teal-gradient':    'linear-gradient(90deg,  #14b8a6, #22d3ee)',
        'teal-gradient-br': 'linear-gradient(135deg, #14b8a6, #22d3ee)',
        'glow-gradient':    'linear-gradient(135deg, rgba(20,184,166,0.12), rgba(34,211,238,0.07))',
      },
      boxShadow: {
        'teal-sm': '0 0 12px rgba(20,184,166,0.18)',
        'teal-md': '0 0 24px rgba(20,184,166,0.30)',
        'teal-lg': '0 0 40px rgba(20,184,166,0.40)',
        'card':    '0 4px 32px rgba(0,0,0,0.50)',
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'slide-up':   'slideUp 0.6s ease-out forwards',
        'scan-line':  'scanLine 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
        glowPulse: {
          '0%,100%': { opacity: '0.5' },
          '50%':     { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        scanLine: {
          '0%':   { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 100%' },
        },
      },
    },
  },
  plugins: [],
};
