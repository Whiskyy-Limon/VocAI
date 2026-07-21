module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Celeste TECSUP — reemplaza el azul genérico de Tailwind en toda la app
        blue: {
          50: '#EAFBFF',
          100: '#CFF6FF',
          200: '#9FEBFF',
          300: '#5FDBFF',
          400: '#22C7F5',
          500: '#00AEEF',
          600: '#008FCB',
          700: '#0072A3',
          800: '#045A80',
          900: '#0B4763',
          950: '#062B3D',
        },
        // Azul-negro TECSUP — complementa el celeste en degradados y fondos oscuros
        indigo: {
          50: '#EAF6FA',
          100: '#CFE9F2',
          200: '#9FD3E6',
          300: '#66B4D1',
          400: '#3A93B8',
          500: '#1D7699',
          600: '#145E7C',
          700: '#0F4A63',
          800: '#0A3549',
          900: '#082635',
          950: '#04141D',
        },
      },
    },
  },
  plugins: [],
}
