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
// Firebase
import storage from 'src/firebase';
import { ref, listAll } from 'firebase/storage';
// Config
import APP_CONFIG from 'src/config/app.config';
// Components
import Page from 'src/components/Page';
import AlertBar from 'src/components/AlertBar';
import MainLoading from 'src/components/MainLoading';
import ConfirmationDialog from 'src/components/ConfirmationDialog';
import CardProduct from '../../../components/CardProduct';
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
  const [currentProductID, setCurrentProductID] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
  const [products, setProducts] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
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
      pathname: APP_CONFIG.ROUTE_EDIT_PRODUCT,
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

  const deletePhotos = () => {
    const listRef = ref(storage, `${storeData.store_id}/${currentProductID}`);
    listAll(listRef)
      .then((res) => {
        res.prefixes.forEach((folderRef) => {
          // All the prefixes under listRef.
          // You may call listAll() recursively on them.
          console.log(folderRef);
        });

        res.items.forEach((itemRef) => {
          // All the items under listRef.
          console.log(itemRef);
        });
      }).catch((error) => {
        // Uh-oh, an error occurred!
        console.error(error);
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
        const resultStatus = !!(response);
        const message = (response)
          ? APP_TEXTS.MESSAGE_DELETE_PRODUCT
          : APP_TEXTS.DELETE_PRODUCT_ERROR;

        handleAlertBar(resultStatus, message);
        getProductsByStore();
        deletePhotos();
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
                <CardProduct
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
