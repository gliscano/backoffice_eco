// React
import React, { useEffect, useState } from 'react';
import PropType from 'prop-types';
// Redux and Router
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
// Material IU
import {
  Box, Button, Card, CardContent, CardHeader, Divider, Grid, TextField, makeStyles, MenuItem,
} from '@material-ui/core';
// Language
import APP_TEXTS from 'src/language/lang_ES';
// Components
import DropZone from 'src/components/dropZonePreview';
import AlertBar from 'src/components/AlertBar';
// services Api
import CategoryServiceApi from 'src/services/CategoryServiceApi';
import ProductServiceApi from 'src/services/ProductServiceApi';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2)
  },
  drop: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  button: {
    paddingTop: theme.spacing(1)
  },
  buttonActions: {
    marginLeft: theme.spacing(1)
  }
}));

const EditProduct = () => {
  // hooks
  const classes = useStyles();
  const userData = useSelector((state) => state.userData);
  const storeData = useSelector((state) => state.storeData);
  const history = useHistory();
  const location = useLocation();
  const { product } = location.state;
  // State
  const [category, setCategory] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setCategorySelected] = useState([{
    name: '',
    id: '',
    subcategories: [],
  }]);
  const [selectedSubcateg, setSubCategSelected] = useState([{
    name: '',
    id: '',
    subcategories: [],
  }]);
  const [photos, setPhotos] = useState('');
  const [initialized, setInitialized] = useState(false);
  const [values, setValues] = useState({
    code: (product && product.code) || '',
    description: (product && product.description) || '',
    storeId: (product && product.storeId) || '',
    price: (product && product.price) || '',
    stock: (product && product.stock) || '',
    title: (product && product.title) || '',
  });
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success',
    callback: null,
  });

  // communication instance
  const categoryServiceApi = new CategoryServiceApi();
  const productServiceApi = new ProductServiceApi();

  const goToCategory = () => {
    history.push('/app/category');
  };

  const goBack = () => {
    history.goBack();
  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const changeCategory = (event) => {
    const data = event.target.value;
    if (!data || !data.category_id) {
      return;
    }

    const newCateg = { ...selectedCategory };
    newCateg.id = data.category_id;
    newCateg.name = data.name;
    newCateg.subcategories = data.subcategories;

    setCategorySelected(newCateg);
    setSubcategories(newCateg.subcategories);
  };

  const changeSubcategory = (event) => {
    const data = event.target.value;
    const newSubcateg = {
      id: data.category_id,
      name: data.name,
    };
    setSubCategSelected(newSubcateg);
  };

  const preselectCategory = () => {
    console.log('FALTA QUE LA API ENVIE CATEGORY_ID EN LOS PRODUCTOS');

    /* if (!product && product.category_id) { return; }

    // get category by ID
    categoryServiceApi.getCategories(userData.token, product.category_id)
      .then((response) => {
        if (response && response.data) {
          setCategory(response.data);
          const { data } = response;
          const newCateg = { ...selectedCategory };
          newCateg.id = data.category_id;
          newCateg.name = data.name;
          newCateg.subcategories = data.subcategories;

          setCategorySelected(newCateg);
          setSubcategories(newCateg.subcategories);
        }
      }); */
  };

  // Handle callback of dropZone component
  const handleCallbackPhotos = (metaPhotos) => {
    const urlPhotos = metaPhotos.map((photo) => photo.preview);
    setPhotos(urlPhotos[0]);
  };

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
      message: (status) ? APP_TEXTS.MESSAGE_UPDATE_PRODUCT : APP_TEXTS.UPDATE_PRODUCT_ERROR,
      severity: (status) ? 'success' : 'error',
      callback: closeAlert,
    });
  };

  const processResult = () => {
    const resultStatus = true;
    handleAlertBar(resultStatus);
  };

  // Request list category from Api
  const getCategories = () => {
    categoryServiceApi.getCategories(userData.token)
      .then((response) => {
        if (response && response.data) {
          setCategory(response.data);
          preselectCategory();
        }
      });

    return false;
  };

  const updateProduct = () => {
    const param = {
      code: values.code,
      description: values.description,
      price: values.price,
      stock: values.stock,
      title: values.title,
      categoryId: selectedCategory.id,
      subcategoryId: selectedSubcateg.id,
      storeId: storeData.store_id,
      token: userData.token,
      photos,
      update: true,
    };

    productServiceApi.createUpdateProduct(param)
      .then((response) => {
        if (response && response.products) {
          processResult(response);
        }
      });
  };

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      getCategories();
    }
  }, []);

  return (
    <form
      autoComplete="off"
      noValidate
      className={classes.root}
    >
      <Grid
        container
        xs={12}
      >
        <Card>
          <CardHeader
            title={APP_TEXTS.EDIT_PRODUCT_TITLE}
          />
          <Divider />
          <CardContent>
            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                md={4}
                xs={12}
              >
                <TextField
                  fullWidth
                  select
                  required
                  name="category"
                  label="Categoría"
                  value={selectedCategory.name}
                  defaultValue=""
                  onChange={changeCategory}
                  variant="outlined"
                  size="small"
                >
                  {category.map((item) => (
                    <MenuItem
                      key={item.name}
                      value={item}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid
                item
                md={4}
                xs={12}
              >
                <TextField
                  fullWidth
                  select
                  label="Subcategoría"
                  name="subcategory"
                  onChange={changeSubcategory}
                  value={selectedSubcateg.name}
                  variant="outlined"
                  size="small"
                >
                  {subcategories.map((itemSub) => (
                    <MenuItem
                      key={itemSub.name}
                      value={itemSub}
                    >
                      {itemSub.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid
                item
                md={4}
                xs={12}
              >
                <Button
                  fullWidth
                  color="primary"
                  variant="outlined"
                  className={classes.button}
                  onClick={goToCategory}
                >
                  {APP_TEXTS.ADD_NEW_CATEGORY}
                </Button>
              </Grid>
              <Grid
                item
                md={12}
                xs={12}
              >
                <TextField
                  fullWidth
                  name="title"
                  label="Titulo del Producto"
                  helperText={`${values.title.length}/200`}
                  error={values.title.length > 200}
                  onChange={handleChange}
                  required
                  value={values.title}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Box
              className={classes.drop}
            >
              <DropZone parentCallback={handleCallbackPhotos} />
            </Box>
            <Box
              spacing={1}
            >
              <Grid
                container
                spacing={2}
              >
                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Descripción"
                    helperText={`${values.description.length}/200`}
                    error={values.description.length > 200}
                    name="description"
                    onChange={handleChange}
                    required
                    value={values.description}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={4}
                  xs={6}
                >
                  <TextField
                    fullWidth
                    label="Precio"
                    name="price"
                    type="number"
                    required
                    onChange={handleChange}
                    value={values.price}
                    error={values.price < 0}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={4}
                  xs={6}
                >
                  <TextField
                    fullWidth
                    label="Stock"
                    name="stock"
                    onChange={handleChange}
                    value={values.stock}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={4}
                  xs={12}
                >
                  <TextField
                    fullWidth
                    label="Código/SKU"
                    name="codeProduct"
                    onChange={handleChange}
                    required
                    value={values.code}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
          <Divider />
          <Box
            display="flex"
            justifyContent="flex-end"
            p={2}
          >
            <Button
              color="grey"
              variant="contained"
              onClick={goBack}
            >
              {APP_TEXTS.BACK_BTN}
            </Button>
            <Button
              color="primary"
              variant="contained"
              className={classes.buttonActions}
              onClick={updateProduct}
            >
              {APP_TEXTS.SAVE_CHANGES_BTN}
            </Button>
          </Box>
        </Card>
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
      </Grid>
    </form>
  );
};

EditProduct.propType = {
  product: PropType.object
};

export default EditProduct;
