import { createMuiTheme, colors } from '@material-ui/core';
import shadows from './shadows';
import typography from './typography';

const theme = createMuiTheme({
  palette: {
    background: {
      dark: '#EDF0F5',
      default: colors.common.white,
      paper: colors.common.white
    },
    primary: {
      main: '#112C50'
    },
    secondary: {
      main: colors.lightBlue[800]
    },
    text: {
      primary: colors.blueGrey[900],
      secondary: colors.grey[900]
    },
    red: {
      main: '#b71c1c',
      dark: '#790000'
    }
  },
  shadows,
  typography
});

export default theme;
