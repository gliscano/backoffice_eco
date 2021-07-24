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
import ResetPassword from 'src/views/auth/ResetPassword';
import TopBar from '../../components/TopBarMain';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 48
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
  }
}));

const MainLayout = () => {
  const classes = useStyles();
  const { path } = useRouteMatch();

  return (
    <div className={classes.root}>
      <TopBar />
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
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
                path={path.concat(APP_CONFIG.ROUTE_RESET_PASSWORD)}
                component={ResetPassword}
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
      </div>
    </div>
  );
};

export default MainLayout;
