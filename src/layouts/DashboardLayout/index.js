import React, { useState } from 'react';
import {
  Redirect,
  Route,
  Switch,
  useRouteMatch
} from 'react-router';
import { makeStyles } from '@material-ui/core';
import AccountView from 'src/views/account/AccountView';
import Category from 'src/views/category';
import CustomerListView from 'src/views/customer/CustomerListView';
import StoreView from 'src/views/store/StoreView';
import StoreCreate from 'src/views/store/StoreCreate';
import StoreEdit from 'src/views/store/StoreEdit';
import DashboardView from 'src/views/reports/DashboardView';
import ProductListView from 'src/views/product/ProductListView';
import LastOrders from 'src/views/order/';
import AddProduct from 'src/views/product/AddProduct';
import SettingsView from 'src/views/settings/SettingsView';
import NotFoundView from 'src/views/errors/NotFoundView';
import { useSelector } from 'react-redux';
import NavBar from './NavBar';
import TopBar from './TopBar';

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
              <Route exact path={`${path}`} component={DashboardView} />
              <Route exact path={`${path}/account`} component={AccountView} />
              <Route exact path={`${path}/category`} component={Category} />
              <Route exact path={`${path}/customers`} component={CustomerListView} />
              <Route exact path={`${path}/createStore`} component={StoreCreate} />
              <Route exact path={`${path}/dashboard`} component={DashboardView} />
              <Route exact path={`${path}/editStore`} component={StoreEdit} />
              <Route exact path={`${path}/settings`} component={SettingsView} />
              <Route exact path={`${path}/store`} component={StoreView} />
              <Route exact path={`${path}/orders`} component={LastOrders} />
              <Route exact path={`${path}/products`} component={ProductListView} />
              <Route exact path={`${path}/products/add`} component={AddProduct} />
              <Route exact path={`${path}/*`} component={NotFoundView} />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
