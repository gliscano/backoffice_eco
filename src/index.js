import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/core';
import theme from 'src/theme';
import GlobalStyles from 'src/components/GlobalStyles';
import Routes from 'src/router/Routes';
import firebaseApp from './firebase';
import store from './store/store';
import * as serviceWorker from './serviceWorker';

ReactDOM.render((
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    <Provider store={store} firebase={firebaseApp}>
      <Routes />
    </Provider>
  </ThemeProvider>
), document.getElementById('root'));

serviceWorker.unregister();
