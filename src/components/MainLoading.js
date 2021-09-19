// React
import React from 'react';
// Material IU
import {
  makeStyles,
  CircularProgress,
} from '@material-ui/core';
// Component
import Logo from 'src/components/Logo';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
  },
  progressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto',
  },
  small: {
    position: 'absolute',
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  progress: {
    zIndex: 1,
  },
}));

const MainLoading = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.progressContainer}>
        <Logo
          className={classes.small}
        />
        <CircularProgress
          className={classes.progress}
          size={64}
        />
      </div>
    </div>
  );
};

export default MainLoading;
