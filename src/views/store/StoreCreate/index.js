import React from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import StoreDetails from './storeDetails';

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

  return (
    <Page
      className={classes.root}
      title="Tiendas"
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={8}
            md={8}
            xs={12}
          >
            <StoreDetails />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Store;
