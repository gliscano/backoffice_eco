import React from 'react';
import PropTypes from 'prop-types';
import {
  Switch,
  Route,
} from 'react-router-dom';
// Constants of Configuration
import APP_CONFIG from 'src/config/app.config';
// Views
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import RegisterView from 'src/views/auth/RegisterView';
import ForgotPassword from 'src/views/auth/ForgotPassword';
import Welcome from 'src/views/auth/Welcome';
import ValidationDone from 'src/views/auth/ValidationDone';

const RoutesMain = ({ path }) => (
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
);

RoutesMain.propType = {
  path: PropTypes.string
};

export default RoutesMain;
