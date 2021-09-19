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
  TextField,
  makeStyles,
  InputAdornment,
  Tooltip,
  Typography,
  IconButton,
} from '@material-ui/core';
import FacebookIcon from '@material-ui/icons/Facebook';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import HelpIcon from '@material-ui/icons/Help';
// Language
import APP_TEXTS from 'src/language/lang_ES';
// Components
import UploadImage from 'src/components/UploadImage';
import Page from 'src/components/Page';
import AlertBar from 'src/components/AlertBar';
// Services Api
import StoreServiceApi from 'src/services/StoreServiceApi';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    height: 80,
    width: 80
  },
  button: {
    marginLeft: theme.spacing(1)
  }
}));

const StoreEdit = ({ className, ...rest }) => {
  const classes = useStyles();
  const userData = useSelector((state) => state.userData);
  const storeData = useSelector((state) => state.storeData);
  const dispatch = useDispatch();
  const storeServiceApi = new StoreServiceApi();
  const history = useHistory();
  const [values, setValues] = useState({
    storeId: (storeData && storeData.store_id) || '',
    storeName: (storeData && storeData.name) || '',
    slogan: (storeData && storeData.title) || '',
    description: (storeData && storeData.description) || '',
    phone: (storeData && storeData.phone) || '',
    facebook: (storeData && storeData.facebook) || '',
    instagram: (storeData && storeData.instagram) || '',
    keywords: (storeData && storeData.keywords) || '',
  });
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    button: APP_TEXTS.ACCEPT_BTN,
    severity: 'success',
    callback: null,
  });

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
      message: (status) ? APP_TEXTS.MESSAGE_UPDATE_STORE : APP_TEXTS.UPDATE_STORE_ERROR,
      severity: (status) ? 'success' : 'error',
      callback: closeAlert,
    });
  };

  const goBack = () => {
    history.goBack();
  };

  const processResult = (response) => {
    const resp = response && response.stores;

    if (resp && resp.status === 'active') {
      handleAlertBar(true);

      dispatch({
        type: SET_STORE_DATA,
        payload: resp
      });

      setTimeout(() => {
        closeAlert();
        goBack();
      }, 2000);
      return;
    }

    handleAlertBar(false);
  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  async function handleUpdate(event) {
    event.preventDefault();

    const dataStore = {
      name: values.storeName,
      title: values.slogan,
      description: values.description,
      phone: values.phone,
      facebook: values.facebook,
      instagram: values.instagram,
      keywords: values.keywords,
      userId: userData.user_id,
      storeId: values.storeId,
      token: userData.token,
    };

    storeServiceApi.requestPost(dataStore, true)
      .then((response) => {
        console.log(response);
        if (response && response.stores) {
          processResult(response);
        }
      });
  }

  return (
    <Page
      className={classes.root}
      title="Store"
    >
      <form
        autoComplete="off"
        noValidate
        className={clsx(classes.root, className)}
        {...rest}
      >
        <Card>
          <CardHeader title="Actualizar Tienda" />
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
                  label="Nombre de la Marca"
                  name="storeName"
                  onChange={handleChange}
                  required
                  value={values.storeName}
                  variant="outlined"
                  style={{ marginBottom: '3%' }}
                />
                <TextField
                  fullWidth
                  label="Slogan de tu Marca"
                  name="slogan"
                  onChange={handleChange}
                  required
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
                  label="Describe lo increible que es tu tienda"
                  name="description"
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
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Facebook"
                  name="facebook"
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
                  label="Instagram"
                  name="instagram"
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
                  label="Número de Teléfono"
                  name="phone"
                  onChange={handleChange}
                  type="number"
                  value={values.phone}
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
                    label="Palabras Claves SEO"
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
              onClick={handleUpdate}
            >
              {APP_TEXTS.SAVE_CHANGES_BTN}
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
        severity={alert.status}
        parentCallback={alert.callback}
      />
      )}
    </Page>
  );
};

StoreEdit.propTypes = {
  className: PropTypes.string
};

export default StoreEdit;
