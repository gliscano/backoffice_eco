// React
import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
// Redux and Router
import { useDispatch, useSelector } from 'react-redux';
import { SET_STORE_DATA } from 'src/store/action_types';
import { useHistory } from 'react-router';
// Material IU and Icons
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import FacebookIcon from '@material-ui/icons/Facebook';
import HelpIcon from '@material-ui/icons/Help';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
// Language
import APP_TEXTS from 'src/language/lang_ES';
// Services Api
import StoreServiceApi from 'src/services/StoreServiceApi';
// components
import Page from 'src/components/Page';
import AlertBar from 'src/components/AlertBar';
// variables of configuration
import APP_CONFIG from 'src/config/app.config';
import generalCategories from 'src/config/generalCategories';
import DropZone from 'src/components/dropZonePreview';
// Hooks
import useFirebase from 'src/hooks/useFirebase';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  avatar: {
    height: 80,
    width: 80
  },
  button: {
    marginLeft: theme.spacing(1)
  },
  dropZoneContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
}));

const StoreCreate = ({ className, ...rest }) => {
  // hooks
  const classes = useStyles();
  const userData = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const history = useHistory();
  const { uploadImage, getURLFile } = useFirebase();
  // states
  const [values, setValues] = useState({
    bannerUrl: '',
    category: '',
    description: '',
    facebook: '',
    instagram: '',
    keywords: '#tiendaonline',
    logoUrl: '',
    phone: '',
    slogan: '',
    storeName: '',
  });
  const [errors, setErrors] = useState({
    storeName: '',
    phone: '',
  });
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    button: APP_TEXTS.ACCEPT_BTN,
    severity: '',
    callback: null,
  });
  const [logo, setLogo] = useState([]);
  const [banner, setBanner] = useState([]);
  // services api
  const storeServiceApi = new StoreServiceApi();
  // constants
  const options = generalCategories.map((option, index) => {
    const firstLetter = option.name[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      category: index,
      ...option,
    };
  });

  const closeAlert = () => {
    setAlert({
      ...alert,
      open: false,
      message: '',
      callback: null,
    });
  };

  const handleAlertBar = ({ message, typeAlert }) => {
    setAlert({
      ...alert,
      open: true,
      message,
      severity: typeAlert,
      callback: closeAlert,
    });
  };

  // Return to previous page
  const goBack = () => {
    history.goBack();
  };

  // Go to page
  const goTo = (path) => {
    history.push(path);
  };

  const uploadLogoImage = (store) => {
    const imagenToLoad = [];

    if (logo.length) {
      const logoImage = logo.pop();
      const extension = logoImage?.type?.replace('image/', '.');
      const logoData = {
        image: logoImage,
        path: `${store?.store_id}/store/logo${extension}`,
      };

      imagenToLoad.push(logoData);
    }

    if (banner.length) {
      const bannerImage = banner.pop();
      const extension = bannerImage?.type?.replace('image/', '.');
      const bannerData = {
        image: bannerImage,
        path: `${store?.store_id}/store/banner${extension}`,
      };

      imagenToLoad.push(bannerData);
    }

    const promises = uploadImage(imagenToLoad);
    return promises;
  };

  // Handle callback of dropZone component
  const handleCallbackLogo = (metaPhotos) => {
    if (!metaPhotos || metaPhotos.length === 0) { return; }

    setLogo(metaPhotos);
  };

  const handleCallbackBanner = (metaPhotos) => {
    if (!metaPhotos || metaPhotos.length === 0) { return; }

    setBanner(metaPhotos);
  };

  const updateStore = async (dataStore) => {
    const update = true;
    dataStore.token = userData?.token;
    dataStore.userId = userData?.user_id;
    dataStore.storeId = dataStore?.store_id;

    const response = await storeServiceApi.requestPost(dataStore, update)
      .then((result) => result);

    return response;
  };

  const processResult = async (response) => {
    const resp = response && response.stores;
    const storeCreated = (resp && resp.status === 'active') || false;

    const paramsAlert = {
      message: (storeCreated) ? APP_TEXTS.MESSAGE_CREATE_STORE : APP_TEXTS.CREATE_STORE_ERROR,
      typeAlert: (storeCreated) ? 'success' : 'error'
    };

    if (storeCreated) {
      // upload image in Storage Cloud
      const loadingPhotos = uploadLogoImage(resp);
      if (loadingPhotos) {
        const images = await Promise.all(loadingPhotos);
        const urlPromises = images.map((img) => getURLFile(img.ref));
        const urls = await Promise.all(urlPromises);

        urls.forEach((url) => {
          if (url.indexOf('store%2Flogo.') >= 0) {
            resp.logoUrl = url;
          } else if (url.indexOf('store%2Fbanner.') >= 0) {
            resp.bannerUrl = url;
          }
        });
        console.log('resp', resp);

        await updateStore(resp);
      }

      dispatch({
        type: SET_STORE_DATA,
        payload: resp
      });

      // Show successful alert
      handleAlertBar(paramsAlert);

      setTimeout(() => {
        closeAlert();
        goTo(APP_CONFIG.ROUTE_STORE);
      }, 2000);
      return;
    }

    // Show error alert
    handleAlertBar(paramsAlert);
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

  const updateCategorySelected = (data) => {
    setValues({
      ...values,
      category: data
    });
  };

  const validateData = () => {
    let confirmedError = false;

    const helperText = {
      phone: APP_TEXTS.REQUIRED_PHONE_NUMBER,
      storeName: APP_TEXTS.REQUIRED_NAME_STORE,
    };

    Object.entries(values).forEach(([name, value]) => {
      let text = helperText[name] || '';
      if (value === '' && text !== '') {
        console.log(name, value, text);
        confirmedError = true;
      } else {
        text = '';
      }
      // set Error
      handleError(name, text);
    });

    return confirmedError;
  };

  async function handleCreate(event) {
    event.preventDefault();

    // validate data required
    if (validateData() || !userData.user_id) {
      return;
    }

    const dataStore = {
      bannerUrl: values.bannerUrl,
      description: values.description || APP_TEXTS.DESCRIPTION_DEFAULT,
      facebook: values.facebook || ' ',
      instagram: values.instagram || ' ',
      keywords: values.keywords,
      logoUrl: values.logoUrl,
      name: values.storeName,
      phone: values.phone,
      title: values.slogan || values.storeName,
      token: userData.token,
      userId: userData.user_id,
    };

    storeServiceApi.requestPost(dataStore)
      .then((response) => processResult(response));
  }

  return (
    <Page
      className={classes.root}
      title="Crear Tienda"
    >
      <form
        autoComplete="off"
        noValidate
        className={clsx(classes.root, className)}
        {...rest}
      >
        <Card
          lg={8}
          md={6}
          xs={12}
        >
          <CardHeader title="Crear Tienda" />
          <Divider />
          <CardContent>
            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                md={6}
                xs={12}
                className={classes.dropZoneContainer}
              >
                <Typography>{APP_TEXTS.LOGO_STORE}</Typography>
                <DropZone parentCallback={handleCallbackLogo} maxFiles={1} />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                className={classes.dropZoneContainer}
              >
                <Typography>{APP_TEXTS.BANNER_STORE}</Typography>
                <DropZone parentCallback={handleCallbackBanner} maxFiles={1} />
              </Grid>
              <Grid
                item
                md={12}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Nombre de la Marca"
                  name="storeName"
                  error={errors.storeName !== ''}
                  helperText={errors.storeName}
                  onChange={handleChange}
                  required
                  value={values.storeName}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={12}
                xs={12}
              >
                <TextField
                  fullWidth
                  name="description"
                  label={APP_TEXTS.DESCRIPTION_STORE}
                  required
                  multiline
                  rows={3}
                  onChange={handleChange}
                  value={values.description}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={12}
                xs={12}
              >
                <Autocomplete
                  id="grouped-Category"
                  name="category"
                  size="small"
                  options={
                    options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))
                  }
                  groupBy={(option) => option.firstLetter}
                  getOptionLabel={(option) => (option && option.name)}
                  onChange={(event, option) => updateCategorySelected(option)}
                  renderInput={(params) => <TextField {...params} label="Selecciona una Categoría" variant="outlined" />}
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  name="facebook"
                  label="Facebook"
                  helperText={`www.facebook.com/${values.facebook}`}
                  onChange={handleChange}
                  value={values.facebook}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FacebookIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  name="instagram"
                  label="Instagram"
                  helperText={`www.instagram.com/${values.instagram}`}
                  onChange={handleChange}
                  value={values.instagram}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AlternateEmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  name="phone"
                  type="number"
                  label={APP_TEXTS.PHONE_STORE}
                  error={errors.phone !== ''}
                  helperText={errors.phone}
                  value={values.phone}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WhatsAppIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <Tooltip title={APP_TEXTS.KEYWORD_RESEARCH}>
                  <TextField
                    fullWidth
                    label={APP_TEXTS.KEYWORDS_STORE}
                    name="keywords"
                    onChange={handleChange}
                    required
                    value={values.keywords}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton>
                            <HelpIcon />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Tooltip>
              </Grid>
            </Grid>
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
              className={classes.button}
              onClick={goBack}
            >
              {APP_TEXTS.CANCEL_BTN}
            </Button>
            <Button
              color="primary"
              variant="contained"
              className={classes.button}
              onClick={handleCreate}
            >
              {APP_TEXTS.CREATE_STORE_BTN}
            </Button>
          </Box>
        </Card>
      </form>
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
    </Page>
  );
};

StoreCreate.propTypes = {
  className: PropTypes.string
};

export default StoreCreate;
