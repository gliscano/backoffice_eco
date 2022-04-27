import { createMuiTheme, colors } from '@material-ui/core';
import shadows from './shadows';
import typography from './typography';

const theme = createMuiTheme({
  palette: {
    background: {
      dark: '#F6F8FA',
      white: colors.common.white,
      default: colors.common.white,
      paper: colors.common.white
    },
    primary: {
      main: '#082948'
    },
    secondary: {
      main: colors.lightBlue[800],
      light: '#15B6C8',
    },
    tertiary: {
      main: '#b71c1c',
    },
    text: {
      primary: colors.blueGrey[900],
      secondary: colors.grey[900],
      white: colors.common.white,
    },
    red: {
      main: '#b71c1c',
      dark: '#790000',
      light: '#F75B4A',
    },
    blueGrey: {
      main: '#cfd8dc',
      dark: '#455a64',
      light: '#eceff1',
    },
    green: {
      main: '#00AB55',
      light: '#99FFBE',
    },
  },
  shadows,
  typography
});

export default theme;
