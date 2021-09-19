// React
import React, { useState } from 'react';
// Redux and Router
import { useSelector } from 'react-redux';
import {
  Redirect,
  Route,
  Switch,
  useRouteMatch
} from 'react-router';
// Material IU
import { makeStyles } from '@material-ui/core';
// Views
import AccountView from 'src/views/account/AccountView';
import AddProduct from 'src/views/product/AddProduct';
import Address from 'src/views/address';
import ListCategory from 'src/views/category/ListCategory';
import AddCategory from 'src/views/category/AddCategory';
import CustomerListView from 'src/views/customer/CustomerListView';
import DashboardView from 'src/views/reports/DashboardView';
import EditProduct from 'src/views/product/EditProduct';
import LastOrders from 'src/views/order/';
import NotFoundView from 'src/views/errors/NotFoundView';
import ProductListView from 'src/views/product/ProductListView';
import SettingsView from 'src/views/settings/SettingsView';
import StoreCreate from 'src/views/store/StoreCreate';
import StoreEdit from 'src/views/store/StoreEdit';
import StoreView from 'src/views/store/StoreView';
// Constants of Configuration
import APP_CONFIG from 'src/config/app.config';
// components
import NavBar from './NavBar';
import TopBar from '../../components/TopBarHome';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256
    }
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

const DashboardLayout = () => {
  const classes = useStyles();
  const { path } = useRouteMatch();
  const userData = useSelector((state) => state.userData);
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className={classes.root}>
      <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
      <NavBar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
      />
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            {!userData.logged && <Redirect to="/" />}
            <Switch>
              <Route
                exact
                path={`${path}`}
                component={DashboardView}
              />
              <Route
                exact
                path={`${APP_CONFIG.ROUTE_ACCOUNT}`}
                component={AccountView}
              />
              <Route
                exact
                path={APP_CONFIG.ROUTE_ADDRESS}
                component={Address}
              />
              <Route
                exact
                path={`${APP_CONFIG.ROUTE_CATEGORY}`}
                component={ListCategory}
              />
              <Route
                exact
                path={path.concat(APP_CONFIG.ROUTE_CREATE_CATEGORY)}
                component={AddCategory}
              />
              <Route
                exact
                path={`${APP_CONFIG.ROUTE_CUSTOMERS}`}
                component={CustomerListView}
              />
              <Route
                exact
                path={`${APP_CONFIG.ROUTE_CREATE_STORE}`}
                component={StoreCreate}
              />
              <Route
                exact
                path={`${APP_CONFIG.ROUTE_DASHBOARD}`}
                component={DashboardView}
              />
              <Route
                exact
                path={`${APP_CONFIG.ROUTE_EDIT_STORE}`}
                component={StoreEdit}
              />
              <Route
                exact
                path={`${APP_CONFIG.ROUTE_SETTINGS}`}
                component={SettingsView}
              />
              <Route
                exact
                path={`${APP_CONFIG.ROUTE_STORE}`}
                component={StoreView}
              />
              <Route
                exact
                path={`${APP_CONFIG.ROUTE_ORDERS}`}
                component={LastOrders}
              />
              <Route
                exact
                path={`${APP_CONFIG.ROUTE_PRODUCTS}`}
                component={ProductListView}
              />
              <Route
                exact
                path={path.concat(APP_CONFIG.ROUTE_CREATE_PRODUCT)}
                component={AddProduct}
              />
              <Route
                exact
                path={path.concat(APP_CONFIG.ROUTE_EDIT_PRODUCT)}
                component={EditProduct}
              />
              <Route
                exact
                path={`${path}/*`}
                component={NotFoundView}
              />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
