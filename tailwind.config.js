module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    mode: 'jit',
    extend: {},
    colors: {
      white: '#f2f2f2',
      maroon: '#632121',
      yellow: '#ffff9f',
      gray: '#e5e7eb',
      black: '#1e1e1e',
      clearWhite: '#FFFFFF',
      pink: '#FF00FF',
      red: '#d0342c',
    },
    fontFamily: {
      Lora: ['Lora', 'sans-serif'],
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
}
