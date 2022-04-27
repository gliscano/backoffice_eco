// React
import React from 'react';
// Router and Redux
import { useRouteMatch } from 'react-router';
import { useSelector } from 'react-redux';
// Material IU
import { makeStyles } from '@material-ui/core';
// Routes
import RoutesMain from 'src/router/RoutesMain';
// Components
import AlertBar from 'src/components/AlertBar';
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
  const appAlertData = useSelector((state) => state.app.alert);

  return (
    <div className={classes.root}>
      <div>
        <TopBar />
      </div>
      <div className={classes.wrapper}>
        <RoutesMain path={path} />
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

export default MainLayout;
