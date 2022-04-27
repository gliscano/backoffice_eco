import React from 'react';
import PropTypes from 'prop-types';
// Material IU and Icons
import {
  makeStyles,
  Slide,
  Snackbar
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: '100%'
  },
  snackbar: {
    width: '50%',
  },
  alert: {
    width: '100%',
  },
}));

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const AlertBar = ({
  open,
  message,
  severity,
  parentCallback = null,
}) => {
  // hooks
  const classes = useStyles();

  const handleResponse = (resp) => {
    open = false;
    parentCallback && parentCallback(resp);
  };

  return (
    <div
      className={classes.root}
    >
      <Snackbar
        open={open}
        autoHideDuration="4000"
        className={classes.snackbar}
        TransitionComponent={Transition}
        onClose={handleResponse}
      >
        <Alert
          severity={severity}
          className={classes.alert}
          variant="filled"
          onClose={handleResponse}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

AlertBar.propTypes = {
  open: PropTypes.bool,
  message: PropTypes.string,
  severity: PropTypes.string,
  parentCallback: PropTypes.func,
};

export default AlertBar;
