// React
import React from 'react';
// Router
// import { useHistory } from 'react-router-dom';
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
  searchField: {
    marginRight: theme.spacing(1),
  }
}));

const Toolbar = ({
  className,
  totalCategories,
  callbackAddCategory,
}) => {
  const classes = useStyles();
  // const history = useHistory();

  // const goTo = (path) => {
  //   history.push(path);
  // };

  return (
    <div className={clsx(classes.root, className)}>
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
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            placeholder={APP_TEXTS.SEARCH_CATEGORY}
            variant="outlined"
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
        >
          <Box className={classes.buttonsGroup}>
            <Box className={classes.boxPublications}>
              <Typography
                variant="body2"
                gutterBottom
              >
                {totalCategories}
                {' '}
                {'Categorías'}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<AddBoxIcon />}
              onClick={callbackAddCategory}
            >
              <span className={classes.title}>
                {APP_TEXTS.ADD}
              </span>
            </Button>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string,
  totalCategories: PropTypes.number,
  callbackAddCategory: PropTypes.func
};

export default Toolbar;
