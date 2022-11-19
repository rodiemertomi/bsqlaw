module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    mode: 'jit',
    extend: {
      keyframes: {
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-80px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': {  transform: 'translateY(-350px)' },
          '100%': {  transform: 'translateY(0)' },
        },
        popUp: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-50px)',
          },
        },
        moveTop: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-100px)',
          },
        },
        moveRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-50px)',
          },
        },
        moveLeft: {
          '0%': {
            opacity: '0',
            transform: 'translateX(100px)',
          },
        },
      },
    },
    colors: {
      white: '#f2f2f2',
      maroon: '#632121',
      yellow: '#ffff9f',
      gray: '#e5e7eb',
      black: '#1e1e1e',
      clearWhite: '#FFFFFF',
      gold: '#ab940b',
      pink: '#FF00FF',
      modalbg: 'rgba(0, 0, 0, 0.5)',
    },
    fontFamily: {
      Lora: ['Lora', 'sans-serif'],
      poppins: ['Poppins'],
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
}
