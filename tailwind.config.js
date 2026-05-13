/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
    "**/*.jsx", // قلب على أي ملف jsx في أي بلاصة
    "**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        emerald: '#047857',
        gold: '#D4AF37',
      },
    },
  },
  plugins: [],
}