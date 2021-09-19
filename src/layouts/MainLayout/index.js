// React
import React from 'react';
// Router
import { Route, Switch, useRouteMatch } from 'react-router';
// Material IU
import { makeStyles } from '@material-ui/core';
// Constants of Configuration
import APP_CONFIG from 'src/config/app.config';
// Views and Components
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import RegisterView from 'src/views/auth/RegisterView';
import ForgotPassword from 'src/views/auth/ForgotPassword';
import Welcome from 'src/views/auth/Welcome';
import ValidationDone from 'src/views/auth/ValidationDone';
import TopBar from '../../components/TopBarMain';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
  },
  wrapper: {
    display: 'contents',
  },
}));

const MainLayout = () => {
  const classes = useStyles();
  const { path } = useRouteMatch();

  return (
    <div className={classes.root}>
      <div>
        <TopBar />
      </div>
      <div className={classes.wrapper}>
        <Switch>
          <Route
            exact
            path={`${path}`}
            component={LoginView}
          />
          <Route
            exact
            path={path.concat(APP_CONFIG.ROUTE_LOGIN)}
            component={LoginView}
          />
          <Route
            exact
            path={path.concat(APP_CONFIG.ROUTE_REGISTER)}
            component={RegisterView}
          />
          <Route
            exact
            path={path.concat(APP_CONFIG.ROUTE_FORGOT_PASSWORD)}
            component={ForgotPassword}
          />
          <Route
            exact
            path={path.concat(APP_CONFIG.ROUTE_VALIDATION_DONE)}
            component={ValidationDone}
          />
          <Route
            exact
            path={path.concat(APP_CONFIG.ROUTE_WELCOME)}
            component={Welcome}
          />
          <Route
            exact
            path={`${path}404`}
            component={NotFoundView}
          />
          <Route
            exact
            path={`${path}error`}
            component={NotFoundView}
          />
        </Switch>
      </div>
    </div>
  );
};

export default MainLayout;
