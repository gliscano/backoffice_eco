// React
import React from 'react';
// Redux and Router
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
// Material IU and Icons
import {
  Box,
  Button,
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
// Language
import APP_TEXTS from 'src/language/lang_ES';
// Componets
import Page from 'src/components/Page';
import ProfileStore from './ProfileStore';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(1)
  },
  toolbar: {
    margin: theme.spacing(1)
  },
  button: {
    marginRight: theme.spacing(1)
  },
}));

const Store = () => {
  // hooks
  const classes = useStyles();
  const history = useHistory();
  const storeData = useSelector((state) => state.storeData);

  const goTo = (route) => {
    const path = `/app/${route}`;
    history.push(path);
  };

  return (
    <Page
      className={classes.root}
      title={APP_TEXTS.STORE}
    >
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="flex-end"
          className={classes.toolbar}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={() => goTo('createStore')}
            className={classes.button}
            disabled={storeData.name !== ''}
          >
            {(storeData.name === '') ? APP_TEXTS.CREATE_STORE_BTN : APP_TEXTS.ADD_BRANCH_STORE_BTN}
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => goTo('address')}
            disabled={storeData.name === ''}
          >
            {APP_TEXTS.ADD_ADDRESS}
          </Button>
        </Box>
        <Grid>
          <ProfileStore />
        </Grid>
      </Container>
    </Page>
  );
};

export default Store;
