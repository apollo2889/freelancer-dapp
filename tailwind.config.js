module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        '50rem': '50rem',
        '40rem': '40rem',
      },
      animation: {
        'white-to-purple': 'whiteToPurple 150ms linear forwards',
        'purple-to-white': 'purpleToWhite 150ms linear forwards',
        'gray-to-purple': 'grayToPurple 150ms linear forwards',
        'purple-to-gray': 'purpleToGray 150ms linear forwards',
      },
      keyframes: (theme) => ({
        whiteToPurple: {
          '0%': { backgroundColor: theme('colors.white') },
          '100%': { backgroundColor: theme('colors.purple.600') },
        },
        purpleToWhite: {
          '0%': { backgroundColor: theme('colors.purple.600') },
          '100%': { backgroundColor: theme('colors.white') },
        },
        grayToPurple: {
          '0%': { backgroundColor: theme('colors.gray.300') },
          '100%': { backgroundColor: theme('colors.purple.600') },
        },
        purpleToGray: {
          '0%': { backgroundColor: theme('colors.purple.600') },
          '100%': { backgroundColor: theme('colors.gray.300') },
        },
      }),
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      textColor: ['active'],
      padding: ['active'],
      borderRadius: ['active'],
    },
  },
  plugins: [],
}
