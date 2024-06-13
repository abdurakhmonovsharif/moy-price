const withAnimations = require('animated-tailwindcss')

module.exports = withAnimations({
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                roboto: ['Roboto', 'sans-serif'],
            },
            fontSize: {
                xs: '.75rem',
                sm: '.875rem',
                base: '1rem',
                lg: '1.125rem',
                xl: '1.25rem',
                '2xl': '1.5rem',
                '3xl': '1.875rem',
                '4xl': '2.25rem',
                '5xl': '3rem',
                '6xl': '4rem',
            },
            fontWeight: {
                light: 300,
                regular: 400,
                medium: 500,
                semibold: 600,
                bold: 700,
                black: 900,
            },
        },

        screens: {
            xsm: '320px',

            sm: '520px',
            // => @media (min-width: 640px) { ... }

            md: '798px',
            // => @media (min-width: 768px) { ... }

            lg: '1024px',
            // => @media (min-width: 1024px) { ... }

            xl: '1280px',
            // => @media (min-width: 1280px) { ... }

            '2xl': '1536px',
            // => @media (min-width: 1536px) { ... }
        },

        colors: {
            transparent: 'transparent',
            primary: {
                100: '#C2F8FF',
                200: '#99F3FF',
                300: '#70EEFF',
                400: '#47EAFF',
                500: '#1FE5FF',
                600: '#00D8F5',
                700: '#00B4CC',
                800: '#0090A3',
                900: '#006C7A',
            },
            blue: {
                100: '#A9C0EF',
                200: '#86A7E9',
                300: '#648EE3',
                400: '#4175DC',
                500: '#265ECF',
                600: '#204FAC',
                700: '#193F8A',
                800: '#0F2552',
                900: '#071F45',
            },
            warning: {
                100: '#FEF0C7',
                200: '#FEDF89',
                300: '#FEC84B',
                400: '#FDB022',
                500: '#F79009',
                600: '#DC6803',
                700: '#B54708',
                800: '#93370D',
                900: '#792E0D',
            },
            error: {
                100: '#FEE4E2',
                200: '#FECDCA',
                300: '#FDA29B',
                400: '#F97066',
                500: '#F04438',
                600: '#D92D20',
                700: '#B42318',
                800: '#912018',
                900: '#7A271A',
            },
            success: {
                100: '#D1FADF',
                200: '#A6F4C5',
                300: '#6CE9A6',
                400: '#32D583',
                500: '#12B76A',
                600: '#039855',
                700: '#027A48',
                800: '#05603A',
                900: '#054F31',
            },
            black: {
                100: 'rgba(28, 28, 28, 0.1)',
                200: 'rgba(28, 28, 28, 0.2)',
                300: 'rgba(28, 28, 28, 0.3)',
                400: 'rgba(28, 28, 28, 0.4)',
                500: 'rgba(28, 28, 28, 0.5)',
                600: 'rgba(28, 28, 28, 0.6)',
                700: 'rgba(28, 28, 28, 0.7)',
                800: 'rgba(28, 28, 28, 0.8)',
                900: '#1c1c1c',
            },
            white: {
                100: 'rgba(255, 255, 255, 0.1)',
                200: 'rgba(255, 255, 255, 0.2)',
                300: 'rgba(255, 255, 255, 0.3)',
                400: 'rgba(255, 255, 255, 0.4)',
                700: 'rgba(255, 255, 255, 0.7)',
                800: 'rgba(255, 255, 255, 0.8)',
                900: '#ffffff',
            },
            inputHover: 'rgba(234, 234, 234, 1)',
            loginButton: '#23BB86',
            background: '#EFF4F2',
            trHover: 'rgba(0, 0, 0, 0.03)',
        },
    },
    plugins: [],
})
