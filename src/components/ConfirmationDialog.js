import React from 'react';
import PropTypes from 'prop-types';
import {
  Slide,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const ConfirmationDialog = ({
  open,
  title,
  message,
  primaryButton,
  primaryColor,
  secondaryButton,
  // secondaryColor,
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
      <Dialog
        open={open}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            onClick={() => handleResponse(false)}
          >
            {secondaryButton}
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ backgroundColor: primaryColor }}
            onClick={() => handleResponse(true)}
          >
            {primaryButton}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

ConfirmationDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  message: PropTypes.string,
  primaryButton: PropTypes.string,
  primaryColor: PropTypes.string,
  secondaryButton: PropTypes.string,
  // secondaryColor: PropTypes.string,
  parentCallback: PropTypes.func,
};

export default ConfirmationDialog;
