import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Slide,
  Snackbar
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const AlerBar = ({
  open,
  message,
  severity,
  primaryButton,
  parentCallback,
}) => {
  const onTrigger = (resp) => {
    parentCallback(resp);
    open = false;
  };

  const handleResponse = (resp) => {
    onTrigger(resp);
  };

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration="3000"
        TransitionComponent={Transition}
        onClose={handleResponse}
      >
        <Alert
          severity={severity}
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

AlerBar.propTypes = {
  open: PropTypes.bool,
  message: PropTypes.string,
  severity: PropTypes.string,
  primaryButton: PropTypes.string,
  parentCallback: PropTypes.func,
};

export default AlerBar;
