import { createStitches } from '@stitches/react';


export const {
  config,
  styled,
  globalCss,
  theme,
  css,
  keyframes,
  prefix,
  createTheme,
  getCssText,
  reset
} = createStitches({
  theme: {
    colors: {
      white: '#fff',
      gray900: '#121214',
      gray800: '#202024',
      gray300: '#c4c4cc',
      gray100: '#e1e1e6',

      green500: '#00875f',
      green300: '#00b37e'
    },

    fontSizes: {
      '2xs': '0.75rem', //12px
      xs: '0.875rem', //14px
      sm: '1rem',//16px
      md: '1.125rem', //18px
      lg: '1.25rem',  //20px
      xl: '1.5rem',  //24px
      '2xl': '2rem', //32px
    }
  }
})
