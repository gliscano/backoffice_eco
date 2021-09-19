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
import UploadImage from 'src/components/UploadImage';
import AlertBar from 'src/components/AlertBar';
// variables of configuration
import APP_CONFIG from 'src/config/app.config';
import generalCategories from 'src/config/generalCategories';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2)
  },
  avatar: {
    height: 80,
    width: 80
  },
  button: {
    marginLeft: theme.spacing(1)
  }
}));

const StoreCreate = ({ className, ...rest }) => {
  // hooks
  const classes = useStyles();
  const userData = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const history = useHistory();
  // states
  const [values, setValues] = useState({
    storeName: '',
    slogan: '',
    description: '',
    category: '',
    phone: '',
    facebook: '',
    instagram: '',
    keywords: '#tiendaonline',
  });
  const [errors, setErrors] = useState({
    storeName: '',
    category: '',
    phone: '',
  });
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    button: APP_TEXTS.ACCEPT_BTN,
    severity: '',
    callback: null,
  });
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

  const processResult = (response) => {
    const resp = response && response.stores;
    const storeCreated = (resp && resp.status === 'active') || false;
    const paramsAlert = {
      message: (storeCreated) ? APP_TEXTS.MESSAGE_CREATE_STORE : APP_TEXTS.CREATE_STORE_ERROR,
      typeAlert: (storeCreated) ? 'success' : 'error'
    };

    if (storeCreated) {
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
      storeName: APP_TEXTS.REQUIRED_NAME_STORE,
      phone: APP_TEXTS.REQUIRED_PHONE_NUMBER,
      category: APP_TEXTS.REQUIRED_CATEGORY_STORE,
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

    return confirmedError;
  };

  async function handleCreate(event) {
    event.preventDefault();

    // validate data required
    if (validateData() || !userData.user_id) {
      return;
    }

    const dataStore = {
      name: values.storeName,
      title: values.slogan || values.storeName,
      description: values.description,
      phone: values.phone,
      facebook: values.facebook || ' ',
      instagram: values.instagram || ' ',
      keywords: values.keywords,
      userId: userData.user_id,
      token: userData.token,
    };

    storeServiceApi.requestPost(dataStore)
      .then((response) => processResult(response));
  }

  return (
    <Page
      className={classes.root}
      title="Tienda"
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
          <CardHeader title="Tienda" />
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
              >
                <TextField
                  fullWidth
                  name="storeName"
                  required
                  label={APP_TEXTS.NAME_STORE}
                  error={errors.storeName !== ''}
                  helperText={errors.storeName}
                  value={values.storeName}
                  onChange={handleChange}
                  variant="outlined"
                  style={{ marginBottom: '3%' }}
                />
                <TextField
                  fullWidth
                  name="slogan"
                  label={APP_TEXTS.SLOGAN_STORE}
                  onChange={handleChange}
                  value={values.slogan}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                style={{ display: 'flex' }}
              >
                <Typography>Logo</Typography>
                <UploadImage
                  className={classes.avatar}
                  dispatch={dispatch}
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
                  error={errors.category !== ''}
                  helperText={errors.category}
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
                  helperText="@nombre_plataforma"
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
                  helperText="@nombre_plataforma/"
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
