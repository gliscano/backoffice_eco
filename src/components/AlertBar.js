import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
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
  primaryButton,
  parentCallback,
}) => {
  // hooks
  const classes = useStyles();

  const onTrigger = (resp) => {
    parentCallback(resp);
    open = false;
  };

  const handleResponse = (resp) => {
    onTrigger(resp);
  };

  return (
    <div
      className={classes.root}
    >
      <Snackbar
        open={open}
        autoHideDuration="3000"
        className={classes.snackbar}
        TransitionComponent={Transition}
        onClose={handleResponse}
      >
        <Alert
          severity={severity}
          className={classes.alert}
          action={(
            <Button
              variant="outlined"
              onClick={handleResponse}
            >
              {primaryButton}
            </Button>
          )}
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
  primaryButton: PropTypes.string,
  parentCallback: PropTypes.func,
};

export default AlertBar;
