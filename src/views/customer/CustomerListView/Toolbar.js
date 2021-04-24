import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box, Card, CardContent, TextField, InputAdornment, makeStyles
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Toolbar = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box mt={1}>
        <Card>
          <CardContent>
            <TextField
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon="search" />
                  </InputAdornment>
                )
              }}
              placeholder="Buscar Cliente"
              variant="outlined"
            />
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
