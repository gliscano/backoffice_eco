// React
import React, { useEffect, useState } from 'react';
// Redux and Router
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
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
import APP_CONFIG from 'src/config/app.config';

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

const AddProduct = () => {
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
    code: '',
    description: '',
    storeId: '',
    price: '',
    stock: '',
    title: '',
  });
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success',
    callback: null,
  });
  // hooks
  const classes = useStyles();
  const userData = useSelector((state) => state.userData);
  const storeData = useSelector((state) => state.storeData);
  const history = useHistory();
  // communication instance
  const categoryServiceApi = new CategoryServiceApi();
  const productServiceApi = new ProductServiceApi();

  const goTo = (path) => {
    history.push(path);
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
      message: (status) ? APP_TEXTS.MESSAGE_CREATE_PRODUCT : APP_TEXTS.CREATE_PRODUCT_ERROR,
      severity: (status) ? 'success' : 'error',
      callback: closeAlert,
    });
  };

  const processResult = () => {
    const resultStatus = true;
    handleAlertBar(resultStatus);

    setTimeout(() => {
      goTo(APP_CONFIG.ROUTE_PRODUCTS);
    }, 1000);
  };

  // Get list of products from Api
  const getCategories = () => {
    categoryServiceApi.getCategories(userData.token)
      .then((response) => {
        if (response && response.data) {
          setCategory(response.data);
          if (response.data.length === 1) {
            const data = response.data[0];
            const { name } = data;
            const subcateg = data.subcategories;
            setCategorySelected(name);
            setSubcategories(subcateg);
          }
        } else {
          setCategory([]);
        }
      });

    return false;
  };

  const addNewProduct = () => {
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
      update: false,
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
            title={APP_TEXTS.ADD_PRODUCT_TITLE}
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
                  onClick={() => goTo(APP_CONFIG.ROUTE_CATEGORY)}
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
                    helperText="Moneda USD"
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
                    helperText="Disponibles en Inventario"
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
                    name="code"
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
              onClick={addNewProduct}
            >
              {APP_TEXTS.ADD_PRODUCT}
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

export default AddProduct;
