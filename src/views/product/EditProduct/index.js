// React
import React, { useEffect, useState } from 'react';
import PropType from 'prop-types';
// Redux and Router
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
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
  TextField,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// Language
import APP_TEXTS from 'src/language/lang_ES';
// Components
import DropZone from 'src/components/dropZonePreview';
// services Api
import CategoryServiceApi from 'src/services/CategoryServiceApi';
import ProductServiceApi from 'src/services/ProductServiceApi';
import { HIDE_ALERT, SET_ALERT_DATA } from 'src/store/action_types';

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
  const appData = useSelector((state) => state.app);
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();

  const { product } = location.state;
  // State
  const [category, setCategory] = useState([]);
  const [categoryPreview, setCategoryPreview] = useState({
    categories: [],
  });
  const [selectedCategory, setCategorySelected] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [values, setValues] = useState({
    product_id: (product && product.product_id) || null,
    codeSKU: (product && product.code) || '',
    description: (product && product.description) || '',
    storeId: (product && product.storeId) || '',
    price: (product && product.price) || '',
    stock: (product && product.stock) || '',
    title: (product && product.title) || '',
    photos: (product && product.url_photos) || [],
  });
  const [photos, setPhotos] = useState([]);
  const [photosToPreview, setPhotosToPreview] = useState([]);

  // communication instance
  const categoryServiceApi = new CategoryServiceApi();
  const productServiceApi = new ProductServiceApi();

  const goToCategory = () => {
    history.push('/app/category');
  };

  const goBack = () => {
    history.goBack();
  };

  const getPhotosFromData = () => {
    const urlData = product.url_photos;
    let urls = urlData.split(',');
    urls = (urls.length > 0) ? [...urls] : [];

    setPhotosToPreview(urls);
  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
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
  };

  const preselectCategory = (categories) => {
    const categoryId = product.category_id[0];
    let categoryName = '';

    let getCategory = categories.filter((item) => {
      if (item.category_id === categoryId) {
        return item;
      }

      const { subcategories } = item;
      const subCategory = subcategories.filter((subItem) => subItem.category_id === categoryId);
      return (subCategory.length > 0) ? subCategory : false;
    });
    getCategory = (getCategory.length > 0) ? getCategory[0] : getCategory;

    if (getCategory && getCategory.category_id === categoryId) {
      categoryName = getCategory.name;
    } else if (getCategory && getCategory.subcategories.length) {
      const { subcategories } = getCategory;
      const subCategory = subcategories.filter((subItem) => subItem.category_id === categoryId);
      categoryName = (subCategory.length) ? subCategory[0].name : categoryName;
    }

    setCategorySelected([categoryId]);
    setCategoryPreview((prevState) => ({
      ...prevState,
      categories: [categoryName],
    }));
  };

  // Handle callback of dropZone component
  const handleCallbackPhotos = (metaPhotos) => {
    const arrayPhotos = metaPhotos.map((photo) => photo.preview);
    const urlPhotos = arrayPhotos[0] || values.photos;

    setPhotos(urlPhotos);
  };

  const closeAlert = () => {
    dispatch({
      type: HIDE_ALERT,
      payload: ''
    });
  };

  const handleAlertBar = (status) => {
    const { alert, ...rest } = appData;
    const alertData = {
      ...alert,
      open: true,
      message: (status) ? APP_TEXTS.MESSAGE_UPDATE_PRODUCT : APP_TEXTS.UPDATE_PRODUCT_ERROR,
      severity: (status) ? 'success' : 'error',
      callback: closeAlert,
    };

    const data = {
      ...rest,
      alert: alertData
    };

    dispatch({
      type: SET_ALERT_DATA,
      payload: data
    });
  };

  const processResult = () => {
    const resultStatus = true;
    handleAlertBar(resultStatus);

    setTimeout(() => {
      goBack();
    }, 1000);
  };

  // Request list category from Api
  const getCategories = () => {
    categoryServiceApi.getCategories(userData.token)
      .then((response) => {
        if (response && response.data) {
          setCategory(response.data);
          preselectCategory(response.data);
        }
      });

    return false;
  };

  // Request to update product data in the API
  const updateProduct = () => {
    const categ = selectedCategory.slice(0, 1);
    const param = {
      categoryId: categ,
      code: values.codeSKU,
      description: values.description,
      photos,
      price: values.price,
      product_id: values.product_id,
      stock: values.stock,
      storeId: storeData.store_id,
      title: values.title,
      token: userData.token,
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
      getPhotosFromData();
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
                  >
                    {category.map((item) => (
                      <>
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
                  helperText={`${values.title.length}/60`}
                  error={values.title.length > 60}
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
              <DropZone parentCallback={handleCallbackPhotos} filesToPreview={photosToPreview} />
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
      </Grid>
    </form>
  );
};

EditProduct.propType = {
  product: PropType.object
};

export default EditProduct;
