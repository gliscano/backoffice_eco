import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import {
  Box, Button, Card, TextField, InputAdornment, makeStyles
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AddBoxIcon from '@material-ui/icons/AddBox';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';

const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    marginRight: theme.spacing(1)
  },
  container: {
    display: 'flex',
    padding: theme.spacing(1),
  },
  link: {
    color: '#ffffff'
  },
  search: {
    width: '70%',
  },
}));

const Toolbar = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box>
        <Card
          display="flex"
          className={classes.container}
          justifyContent="flex-start"
        >
          <Button
            color="primary"
            size="small"
            variant="contained"
            className={classes.button}
            startIcon={<AddBoxIcon />}
          >
            <Link
              to="products/add"
              className={classes.link}
            >
              Producto
            </Link>
          </Button>
          <Button
            variant="contained"
            size="small"
            className={classes.button}
            startIcon={<PlaylistAddIcon />}
          >
            <Link
              to="category"
              className={classes.link}
            >
              Categoría
            </Link>
          </Button>
          <TextField
            className={classes.search}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon="search" />
                </InputAdornment>
              )
            }}
            placeholder="Buscar Producto"
            variant="outlined"
          />
        </Card>
      </Box>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
