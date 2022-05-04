// React
import React, { useState } from 'react';
// Redux and Router
import { useSelector } from 'react-redux';
import {
  Redirect,
  useRouteMatch
} from 'react-router';
// Material IU
import { makeStyles } from '@material-ui/core';
// Routes
import RoutesDashboard from 'src/router/RoutesDashboard';
// components
import AlertBar from 'src/components/AlertBar';
import NavBar from './NavBar';
import TopBar from '../../components/TopBarHome';
// import AlertBar from 'src/components/AlertBar';

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
    overflow: 'auto',
    display: 'grid'
  }
}));

const DashboardLayout = () => {
  const classes = useStyles();
  const { path } = useRouteMatch();
  const userData = useSelector((state) => state.userData);
  const storeData = useSelector((state) => state.storeData);
  const appAlertData = useSelector((state) => state.app.alert);
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className={classes.root}>
      <TopBar
        storeName={storeData.name}
        onMobileNavOpen={() => setMobileNavOpen(true)}
      />
      <NavBar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
      />
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            {!userData.logged && <Redirect to="/" />}
            <RoutesDashboard path={path} />
          </div>
        </div>
      </div>
      {(appAlertData && appAlertData.open) && (
        <AlertBar
          open={appAlertData.open}
          message={appAlertData.message}
          primaryButton={appAlertData.button}
          severity={appAlertData.severity}
          parentCallback={appAlertData.callback}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
