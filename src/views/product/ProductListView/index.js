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
// images
import SearchProductImage from 'src/assets/image/products/search_product.png';
// Language
import APP_TEXTS from 'src/language/lang_ES';
// Services Api
import ProductServiceApi from 'src/services/ProductServiceApi';
// theme
import ThemeCustom from 'src/theme';
// Components
import Page from 'src/components/Page';
import AlertBar from 'src/components/AlertBar';
import MainLoading from 'src/components/MainLoading';
import ConfirmationDialog from 'src/components/ConfirmationDialog';
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
  },
  emptyList: {
    textAlign: 'center',
    margin: 'auto',
  },
  imageContainer: {
    textAlign: 'center',
    marginBottom: theme.spacing(2),
  },
}));

const ProductList = () => {
  // States
  const classes = useStyles();
  const [initialized, setInitialized] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [currentProductID, setCurrentProductID] = useState(null);
  const [products, setProducts] = useState([]);
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
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
      open: false,
      severity: '',
      message: '',
      callback: null,
    });
  };

  const handleAlertBar = (status, message) => {
    setAlert({
      open: true,
      message,
      severity: (status) ? 'success' : 'error',
      callback: closeAlert,
    });
  };

  const handleDelete = (event) => {
    if (event === 'clickaway') { return; }

    const idProduct = event.product_id;
    if (!openDialogConfirm) {
      setOpenDialogConfirm(true);
      setCurrentProductID(idProduct);
    }
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

  const getProductsByStore = () => {
    const { token } = userData;

    productServiceApi.getProducts(token)
      .then((response) => {
        if (response && response.products && response.products.length) {
          setProducts(response.products);
          setShowLoading(false);
        } else {
          setProducts([]);
          setShowLoading(false);
        }
      })
      .catch((error) => {
        console.log(`ERROR LOADING PRODUCTS: ERROR: ${error}`);
      });
  };

  const callbackActive = (product) => {
    const { token } = userData;
    const param = { ...product };
    param.photos = product.url_photos;
    param.categoryId = product.category_id;
    param.status = (product.status === 'active') ? 'inactive' : 'active';
    param.storeId = storeData.store_id;
    param.token = token;
    param.update = true;

    productServiceApi.createUpdateProduct(param)
      .then((response) => {
        let resultStatus = false;
        let message = APP_TEXTS.PAUSE_PRODUCT_ERROR;

        if (response && response.products) {
          resultStatus = true;
          message = (response.products.status === 'active') ? APP_TEXTS.MESSAGE_ACTIVE_PRODUCT : APP_TEXTS.MESSAGE_INACTIVE_PRODUCT;
        }

        handleAlertBar(resultStatus, message);
        getProductsByStore();
      });
  };

  const callbackDelete = () => {
    const param = {
      token: userData.token,
      idProduct: currentProductID,
    };

    setOpenDialogConfirm(false);

    productServiceApi.deleteProduct(param)
      .then((response) => {
        let resultStatus = false;
        let message = APP_TEXTS.DELETE_PRODUCT_ERROR;
        if (response) {
          resultStatus = true;
          message = APP_TEXTS.MESSAGE_DELETE_PRODUCT;
        }

        handleAlertBar(resultStatus, message);
        getProductsByStore();
      });
  };

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      setShowLoading(true);
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
            {showLoading && <MainLoading />}
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
                  callbackDelete={handleDelete}
                />
              </Grid>
            ))}
            {((products.length === 0 && !showLoading) && (
              <Grid
                item
                xs={12}
              >
                <Box className={classes.emptyList}>
                  <Box className={classes.imageContainer}>
                    <img
                      src={SearchProductImage}
                      width="70%"
                      height="auto"
                      margin="auto"
                      alt="welcome"
                    />
                  </Box>
                  <h4>No tienes productos agregados [Frase Motivacional]</h4>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
        {openDialogConfirm
        && (
        <ConfirmationDialog
          open={openDialogConfirm}
          title={APP_TEXTS.CONFIRMATION_TITLE}
          message={APP_TEXTS.CONFIRM_DELETE_PRODUCT}
          primaryButton={APP_TEXTS.DELETE_BTN}
          secondaryButton={APP_TEXTS.CANCEL_BTN}
          primaryColor={ThemeCustom.palette.red.main}
          parentCallback={callbackDelete}
        />
        )}
        {(alert && alert.open)
        && (
        <AlertBar
          open={alert.open}
          message={alert.message}
          primaryButton={alert.button}
          severity={alert.severity}
          parentCallback={alert.callback}
        />
        )}
      </Container>
    </Page>
  );
};

export default ProductList;
