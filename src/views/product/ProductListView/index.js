// React
import React, { useEffect, useState } from 'react';
// Redux and Router
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
// Material IU and Icons
import {
  Box,
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
// Language
import APP_TEXTS from 'src/language/lang_ES';
// Services Api
import ProductServiceApi from 'src/services/ProductServiceApi';
// Components
import Page from 'src/components/Page';
import AlertBar from 'src/components/AlertBar';
import ProductCard from './ProductCard';
import Toolbar from './Toolbar';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  toolbar: {
    height: '20%'
  },
  productCard: {
    height: '100%'
  }
}));

const ProductList = () => {
  // States
  const classes = useStyles();
  const [initialized, setInitialized] = useState(false);
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success',
    callback: null,
  });
  // hooks
  const history = useHistory();
  const userData = useSelector((state) => state.userData);
  const storeData = useSelector((state) => state.storeData);
  // communication instances
  const productServiceApi = new ProductServiceApi();

  const closeAlert = () => {
    setAlert({
      ...alert,
      open: false,
      message: '',
      callback: null,
    });
  };

  const handleAlertBar = (status) => {
    setAlert({
      ...alert,
      open: true,
      message: (status) ? APP_TEXTS.ACTIVE_PRODUCT : APP_TEXTS.INACTIVE_PRODUCT,
      severity: 'success',
      callback: closeAlert,
    });
  };

  const callbackEdit = (prod) => {
    const to = {
      pathname: 'products/edit',
      state: {
        product: prod,
      },
    };
    history.push(to);
  };

  const callbackActive = (product) => {
    const { token } = userData;
    const param = { ...product };
    param.photos = product.url_photos;
    param.status = (product.status === 'active') ? 'inactive' : 'active';
    param.storeId = storeData.store_id;
    param.token = token;
    param.update = true;

    productServiceApi.createUpdateProduct(param)
      .then((response) => {
        if (response && response.products) {
          const resultStatus = true;
          handleAlertBar(resultStatus);
        }
      });
  };

  const getProductsByStore = () => {
    const { token } = userData;
    productServiceApi.getProducts(token)
      .then((response) => {
        console.log(response);
        if (response && response.products) {
          // BORRAR
          response.products[2].status = 'inactive';
          setProducts(response.products);
        }
      })
      .catch((error) => {
        console.log(`ERROR LOADING PRODUCTS: ERROR: ${error}`);
      });
  };

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      getProductsByStore();
    }
  }, []);

  return (
    <Page
      className={classes.root}
      title={APP_TEXTS.PRODUCTS_BTN}
    >
      <Container maxWidth={false}>
        <Toolbar
          className={classes.toolbar}
          products={products.length}
        />
        <Box mt={2}>
          <Grid
            container
            spacing={1}
          >
            {products.map((product) => (
              <Grid
                item
                key={product.product_id}
                lg={4}
                md={6}
                xs={12}
              >
                <ProductCard
                  key={product.product_id}
                  className={classes.productCard}
                  product={product}
                  callbackEdit={callbackEdit}
                  callbackActive={callbackActive}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        {(alert && alert.open)
        && (
        <AlertBar
          open={alert.open}
          message={alert.message}
          primaryButton={alert.button}
          severity={alert.status}
          parentCallback={alert.callback}
        />
        )}
      </Container>
    </Page>
  );
};

export default ProductList;
