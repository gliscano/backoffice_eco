import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/app" component={DashboardLayout} />
      <Route path="/" component={MainLayout} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
