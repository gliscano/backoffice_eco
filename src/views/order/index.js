import React from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import { useHistory } from 'react-router';
import LastOrders from './LatestOrders';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  toolbar: {
    margin: theme.spacing(1)
  },
}));

const Store = () => {
  const classes = useStyles();
  const history = useHistory();

  const goTo = () => {
    const path = '/app/createStore';
    history.push(path);
  };

  return (
    <Page
      className={classes.root}
      title="Pedidos"
    >
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="flex-start"
          className={classes.toolbar}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={goTo}
          >
            Hola soy un botón
          </Button>
        </Box>
        <Grid>
          <LastOrders />
        </Grid>
      </Container>
    </Page>
  );
};

export default Store;
