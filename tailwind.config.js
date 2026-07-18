/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0E15',
        panel: '#10141D',
        panel2: '#141926',
        mist: '#E9ECF2',
        mute: '#8A92A6',
        dim: '#5A6275',
        amber: '#F0B34C',
        steel: '#7C96C4',
        ok: '#5FBF8A',
      },
      fontFamily: {
        disp: ['"Clash Display"', 'sans-serif'],
        body: ['Satoshi', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      maxWidth: { wrap: '1120px' },
    },
  },
  plugins: [],
};
