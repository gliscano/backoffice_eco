// React
import React from 'react';
// Router
import { Link } from 'react-router-dom';
// Props
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Material IU and Icons
import {
  Button,
  Box,
  Grid,
  InputAdornment,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import SearchIcon from '@material-ui/icons/Search';
// Language
import APP_TEXTS from 'src/language/lang_ES';

const useStyles = makeStyles((theme) => ({
  root: {},
  container: {
    display: 'flex',
    padding: theme.spacing(1),
  },
  link: {
    color: '#ffffff',
  },
  button: {
    fontWeight: theme.typography.fontWeightMedium,
    textTransform: 'none',
    display: 'inline-flex',
    marginLeft: theme.spacing(1),
  },
  buttonsGroup: {
    textAlign: 'right',
  },
  boxPublications: {
    display: 'inline-flex',
    padding: theme.spacing(1),
  },
  icon: {
    marginRight: theme.spacing(0)
  },
  title: {
    textAlign: 'center',
  },
  activePrimary: {
    color: theme.palette.text.white,
    '& $title': {
      fontWeight: theme.typography.fontWeightMedium
    },
    '& $icon': {
      color: theme.palette.text.white,
    }
  },
  activeSecondary: {
    color: theme.palette.secondary.main,
    '& $title': {
      fontWeight: theme.typography.fontWeightMedium
    },
    '& $icon': {
      color: theme.palette.secondary.main,
    }
  },
  searchField: {
    marginRight: theme.spacing(1),
  }
}));

const Toolbar = ({ className, products, ...rest }) => {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Grid
        container
        spacing={1}
      >
        <Grid
          item
          xs={12}
          md={4}
        >
          <TextField
            fullWidth
            size="small"
            className={classes.searchField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            placeholder={APP_TEXTS.SEARCH_PRODUCT}
            variant="outlined"
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
        >
          <Box
            className={classes.buttonsGroup}
          >
            <Box
              className={classes.boxPublications}
            >
              <Typography
                variant="body2"
                gutterBottom
              >
                {products}
                {' '}
                {'productos'}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<AddBoxIcon />}
            >
              <Link
                to="products/add"
                className={classes.activePrimary}
              >
                <span className={classes.title}>
                  {APP_TEXTS.PRODUCT_BTN}
                </span>
              </Link>
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              className={classes.button}
              startIcon={<PlaylistAddIcon />}
            >
              <Link
                to="category"
                className={classes.activeSecondary}
              >
                <span className={classes.title}>
                  {APP_TEXTS.CATEROGY_BTN}
                </span>
              </Link>
            </Button>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string,
  products: PropTypes.number
};

export default Toolbar;
