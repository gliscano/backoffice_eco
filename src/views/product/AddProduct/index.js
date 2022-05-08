// React
import React, { useEffect, useState } from 'react';
// Redux and Router
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
// Material IU
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  makeStyles,
  MenuItem,
  Select,
  Typography,
  TextField,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// Language and Config
import APP_TEXTS from 'src/language/lang_ES';
import APP_CONFIG from 'src/config/app.config';
// Components
import DropZone from 'src/components/dropZonePreview';
// services Api
import CategoryServiceApi from 'src/services/CategoryServiceApi';
import ProductServiceApi from 'src/services/ProductServiceApi';

import storage from 'src/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import useAlertBar from 'src/hooks/useAlertBar';

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
  },
  categoryList: {
    borderTop: '1px solid #EDF0F5',
    borderBottom: '1px solid #EDF0F5',
  },
  itemSubcategory: {
    marginLeft: theme.spacing(2),
  }
}));

const AddProduct = () => {
  // State
  const [category, setCategory] = useState([]);
  const [selectedCategory, setCategorySelected] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [categoryPreview, setCategoryPreview] = useState({
    categories: [],
  });
  const [values, setValues] = useState({
    codeSKU: '',
    description: '',
    price: '',
    stock: '',
    title: '',
  });
  const [errors, setErrors] = useState({
    title: '',
    price: '',
    category_id: '',
  });
  // hooks
  const classes = useStyles();
  const userData = useSelector((state) => state.userData);
  const storeData = useSelector((state) => state.storeData);
  const { showAlert, hideAlert } = useAlertBar();
  const history = useHistory();
  // communication instance
  const categoryServiceApi = new CategoryServiceApi();
  const productServiceApi = new ProductServiceApi();
  // constants
  const urlDefaultImage = '/static/images/products/notAvailable.jpg';
  // variable
  let urlPhotos = urlDefaultImage;
  let updateProduct = false;

  const goTo = (path) => {
    history.push(path);
  };

  const goBack = () => {
    history.goBack();
  };

  const handleError = (name, value) => {
    setErrors((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });

    // clear error
    handleError(event.target.name, '');
  };

  const validateData = () => {
    let confirmedError = false;

    const helperText = {
      title: APP_TEXTS.REQUIRED_TITLE_PRODUCT,
      price: APP_TEXTS.REQUIRED_PRICE,
    };

    Object.entries(values).forEach(([name, value]) => {
      let text = helperText[name] || '';
      if (value === '' && text !== '') {
        confirmedError = true;
      } else {
        text = '';
      }
      // set Error
      handleError(name, text);
    });

    if (selectedCategory.length === 0) {
      confirmedError = true;
      handleError('category_id', APP_TEXTS.REQUIRED_CATEGORY_STORE);
    }

    return confirmedError;
  };

  const changeCategory = (data) => {
    if (!data || !data.category_id) {
      return;
    }

    let newArray = [];
    let newArrayPreview = [];
    const preview = [...categoryPreview.categories];

    if (selectedCategory.indexOf(data.category_id) > -1) {
      newArray = selectedCategory.filter((item) => item !== data.category_id);
      newArrayPreview = preview.filter((item) => item !== data.name);
    } else {
      newArray = [...selectedCategory];
      newArray.push(data.category_id);
      newArrayPreview = [...preview];
      newArrayPreview.push(data.name);
    }

    setCategorySelected(newArray);
    setCategoryPreview((prevState) => ({
      ...prevState,
      categories: newArrayPreview,
    }));

    // clear error
    handleError('category_id', '');
  };

  const uploadPhotos = (product) => {
    if (!photos.length) { return false; }

    const promises = photos.map((photo) => {
      const fileRef = ref(storage, `${storeData.store_id}/${product.product_id}/${photo.name}`);
      return uploadBytes(fileRef, photo);
    });

    return promises;
  };

  // Handle callback of dropZone component
  const handleCallbackPhotos = (metaPhotos) => {
    if (!metaPhotos || metaPhotos.length === 0) { return; }

    setPhotos(metaPhotos);
  };

  const handleAlertBar = (status) => {
    const message = (status) ? APP_TEXTS.MESSAGE_CREATE_PRODUCT : APP_TEXTS.CREATE_PRODUCT_ERROR;
    const typeAlert = (status) ? 'success' : 'error';

    showAlert({ message, typeAlert });
  };

  // Get list of products from Api
  const getCategories = () => {
    categoryServiceApi.getCategories(userData.token)
      .then((response) => {
        if (response && response.data) {
          const sortedData = response.data.sort((a, b) => (a.name > b.name && 1) || -1);
          setCategory(sortedData);
          if (response.data.length === 1) {
            const data = response.data[0];
            const { name } = data;
            setCategorySelected(name);
          }
        } else {
          setCategory([]);
        }
      });

    return false;
  };

  const getDataToApi = () => {
    const skuRandom = Math.floor(12345 * Math.random());
    const categ = selectedCategory.slice(0, 1);
    const param = {
      categoryId: categ,
      code: values.codeSKU || skuRandom,
      description: values.description || APP_TEXTS.WITHOUT_DESCRIPTION_PRODUCT,
      photos: urlPhotos,
      price: values.price,
      stock: values.stock || 1000000,
      storeId: storeData.store_id,
      title: values.title,
      token: userData.token,
      update: updateProduct,
    };

    return param;
  };

  const updateUrlImage = async (loadingPhotos, productCreated) => {
    const images = await Promise.all(loadingPhotos);
    const urlPromises = images.map((img) => getDownloadURL(img.ref));
    const urls = await Promise.all(urlPromises);
    urlPhotos = urls.join();

    // update product
    updateProduct = true;
    const params = getDataToApi();
    const propsToUpdate = {
      ...params,
      codeSKU: productCreated.code,
      categoryId: productCreated.category_id,
      product_id: productCreated.product_id,
    };

    productServiceApi.createUpdateProduct(propsToUpdate)
      .then((response) => {
        if (response && response.products) {
          handleAlertBar(true);

          setTimeout(() => {
            hideAlert();
            goTo(APP_CONFIG.ROUTE_PRODUCTS);
          }, 1000);
        } else {
          // Show error alert
          handleAlertBar(false);
        }
      });
  };

  const processResult = (prod) => {
    // upload image in Storage Cloud
    const loadingPhotos = uploadPhotos(prod);
    if (loadingPhotos) {
      updateUrlImage(loadingPhotos, prod);
    } else {
      handleAlertBar(true);

      setTimeout(() => {
        hideAlert();
        goTo(APP_CONFIG.ROUTE_PRODUCTS);
      }, 1000);
    }
  };

  const addNewProduct = () => {
    const param = getDataToApi();

    // validate data required
    if (validateData() || !userData.user_id) {
      return;
    }

    productServiceApi.createUpdateProduct(param)
      .then((response) => {
        if (response && response.products) {
          processResult(response.products);
        } else {
          // Show error alert
          handleAlertBar(false);
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
                md={8}
                xs={12}
              >
                <FormControl variant="outlined" fullWidth size="small">
                  <InputLabel id={APP_TEXTS.CATEGORY_LABEL}>{APP_TEXTS.CATEGORY_LABEL}</InputLabel>
                  <Select
                    required
                    name="category"
                    label={APP_TEXTS.CATEGORY_LABEL}
                    labelId={APP_TEXTS.CATEGORY_LABEL}
                    value={categoryPreview.categories}
                    renderValue={(selected) => selected.join(', ')}
                    error={errors.category_id !== ''}
                  >
                    {category.map((item) => (
                      <>
                        {(item.subcategories.length > 0)
                          ? (
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1"
                              >
                                <Typography>{item.name}</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                {item.subcategories.map((itemSub) => (
                                  <MenuItem
                                    key={itemSub.category_id}
                                    className={classes.itemSubcategory}
                                    onClick={() => changeCategory(itemSub)}
                                  >
                                    <Checkbox
                                      id={itemSub.category_id}
                                      checked={selectedCategory.indexOf(itemSub.category_id) > -1}
                                    />
                                    <ListItemText primary={itemSub.name} />
                                  </MenuItem>
                                ))}
                              </AccordionDetails>
                            </Accordion>
                          )
                          : (
                            <MenuItem
                              key={item.category_id}
                              className={classes.itemSubcategory}
                              onClick={() => changeCategory(item)}
                            >
                              <Checkbox
                                id={item.category_id}
                                checked={selectedCategory.indexOf(item.category_id) > -1}
                              />
                              <ListItemText primary={item.name} />
                            </MenuItem>
                          )}
                      </>
                    ))}
                  </Select>
                </FormControl>
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
                  label={APP_TEXTS.TITLE_LABEL}
                  error={errors.title !== '' || values.title.length > 60}
                  helperText={`${values.title.length}/60` || errors.title}
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
                    label={APP_TEXTS.DESCRIPTION_LABEL}
                    helperText={`${values.description.length}/2000`}
                    error={values.description.length > 2000}
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
                    label={APP_TEXTS.PRICE_LABEL}
                    name="price"
                    type="number"
                    required
                    error={errors.price !== '' || values.price < 0}
                    helperText={errors.price}
                    onChange={handleChange}
                    value={values.price}
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
                    label={APP_TEXTS.STOCK_LABEL}
                    helperText={APP_TEXTS.STOCK_AVAILABLE_HELPER}
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
                    label={APP_TEXTS.CODE_SKU_LABEL}
                    name="codeSKU"
                    onChange={handleChange}
                    value={values.codeSKU}
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
      </Grid>
    </form>
  );
};

export default AddProduct;
