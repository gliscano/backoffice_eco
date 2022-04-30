// React
import React, { useEffect, useState } from 'react';
import GoogleLogin from 'react-google-login';
// Redux and Router
import { useDispatch } from 'react-redux';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { SET_STORE_DATA, SET_USER_DATA } from 'src/store/action_types';
// tools
import * as Yup from 'yup';
import { Formik } from 'formik';
// Material IU and Icons
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  makeStyles,
  Avatar,
  Collapse,
  IconButton,
  InputAdornment,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import GoogleColorsIcon from 'src/assets/icons/google.svg';
// components
import Page from 'src/components/Page';
import MainLoading from 'src/components/MainLoading';
// Languages
import APP_TEXTS from 'src/language/lang_ES';
// Services Api
import UserServiceApi from 'src/services/UserServiceApi';
import LoginServiceApi from 'src/services/LoginServiceApi';
import StoreServiceApi from 'src/services/StoreServiceApi';
import APP_CONFIG from 'src/config/app.config';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    justifyContent: 'center',
    height: 'calc(100% - 64px)',
    margin: 'auto',
    overflow: 'hidden',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
    width: '100%',
  },
  mainContainer: {
    backgroundColor: theme.palette.background.white,
    borderRadius: '5px',
    marginRight: '8px',
    paddingTop: '16px',
    paddingBottom: '16px',
    boxShadow: '0px 1px 8px -3px rgba(69,90,100,0.8)',
  },
  iconGoogle: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  iconFacebook: {
    width: theme.spacing(3.5),
    height: theme.spacing(3.5),
  },
  buttonText: {
    textTransform: 'none',
  },
  alert: {
    boxShadow: '0px 1px 8px -3px rgba(69,90,100,0.8)',
  },
}));

const LoginView = () => {
  // states
  const [initialized, setInitialized] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPreloader, setShowPreloader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({
    content: '',
    type: 'info', // error, warning, info, success
    show: false,
  });
  // hooks
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  // communication instances
  const loginServiceApi = new LoginServiceApi();
  const userServiceApi = new UserServiceApi();
  const storeServiceApi = new StoreServiceApi();

  const goTo = (stores) => {
    const path = (stores && !!stores.store_id)
      ? APP_CONFIG.ROUTE_HOME : APP_CONFIG.ROUTE_CREATE_STORE;

    history.push(path);
  };

  // Set User Info in Redux
  const setUserData = (data) => {
    if (data) {
      dispatch({
        type: SET_USER_DATA,
        payload: data
      });
    }
  };

  // Set User Info in Redux
  const setStoreDataRedux = (data) => {
    if (data) {
      dispatch({
        type: SET_STORE_DATA,
        payload: data
      });
    }
  };

  async function getInfoByUser(userId, token) {
    return userServiceApi.getInfoByUser(userId, token)
      .then((response) => {
        if (response && response.data) {
          setUserData(response.data);
          return response.data;
        }

        return false;
      });
  }

  async function getStoresByUser(userId, token) {
    const params = {
      token,
      user_id: userId
    };
    return storeServiceApi.getStoresByUser(params)
      .then((response) => {
        if (response && response.stores) {
          const defaultStore = response.stores[0];
          return defaultStore;
        }

        return false;
      });
  }

  const initializeApp = async (loginData) => {
    const infoByUser = getInfoByUser(loginData.user_id, loginData.token);
    const storesByUser = getStoresByUser(loginData.user_id, loginData.token);

    const response = await Promise.all([infoByUser, storesByUser]);
    const dataUser = response?.length && response[0];
    const dataStore = response?.length && response[1];

    setInitialized(true);
    setUserData(loginData);
    setStoreDataRedux(dataStore);

    return { dataUser, dataStore };
  };

  async function processResultLogin(loginData) {
    if (loginData && loginData.token) {
      setShowPreloader(true);
      const { dataStore } = await initializeApp(loginData);

      setShowPreloader(false);
      goTo(dataStore);
    } else if ((loginData.code >= 0) && loginData.message) {
      setMessage({
        show: true,
        type: loginData.type,
        content: loginData.message,
      });
    }
  }

  async function updateToken(credentials) {
    loginServiceApi.updateTokenRequest(credentials)
      .then((response) => {
        if (response && response.token) {
          processResultLogin(response);
        }
      })
      .catch(() => {
        processResultLogin(false);
      });
  }

  const getDataLocalStorage = () => {
    const dataLocal = loginServiceApi.getDataLocalStorage();
    if (dataLocal) {
      updateToken(dataLocal);
    }
  };

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      getDataLocalStorage();
    }
  }, []);

  const handleGoogleLogin = (googleData) => {
    console.log(googleData);
  };

  async function handleLogIn(event) {
    event.preventDefault();
    setMessage({ show: false, content: '' });

    if (!username) {
      setMessage({
        show: true,
        type: 'info',
        content: APP_TEXTS.REQUIRED_USER
      });
      return;
    }

    if (!password) {
      setMessage({
        show: true,
        type: 'info',
        content: APP_TEXTS.REQUIRED_PASSWORD
      });
      return;
    }

    const credentials = {
      username,
      password,
    };

    loginServiceApi.obtainTokenRequest(credentials)
      .then((response) => {
        if (response) {
          processResultLogin(response);
        }
      })
      .catch((error) => {
        processResultLogin(error);
      });
  }

  return (
    <Page
      className={classes.root}
      title="Login"
    >
      {showPreloader && (
        <Box
          display="flex"
          flexDirection="column"
          height="100%"
          justifyContent="center"
        >
          <MainLoading />
        </Box>
      )}
      {!showPreloader && (
        <Box
          display="flex"
          flexDirection="column"
          height="100%"
          justifyContent="center"
        >
          <Container
            maxWidth="sm"
            className={classes.mainContainer}
          >
            <Formik
              initialValues={{
                email: username,
                password,
              }}
              validationSchema={Yup.object().shape({
                email: Yup.string().email('Ingresa un correo electrónico válido').max(255).required('Correo electrónico es requerido'),
                password: Yup.string().max(255).required('La contraseña es requerida')
              })}
            >
              {({
                errors,
                isSubmitting,
                touched
              }) => (
                <form>
                  <Box mb={3}>
                    <Typography
                      color="textPrimary"
                      variant="h2"
                    >
                      Iniciar Sesión
                    </Typography>
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      variant="body2"
                    >
                      Inicia sesión y comienza a gestionar tu tienda
                    </Typography>
                  </Box>
                  <Grid
                    container
                    spacing={2}
                  >
                    <Grid
                      item
                      xs={12}
                    >
                      <GoogleLogin
                        fullWidth
                        size="large"
                        style={{ backgroundColor: '#000000' }}
                        clientId="21745975916-p9m28i5u1tva9d46thkrcjd6ihj89sn9.apps.googleusercontent.com"
                        buttonText="Iniciar con Google"
                        onSuccess={handleGoogleLogin}
                        onFailure={handleGoogleLogin}
                        render={(renderProps) => (
                          <Button
                            fullWidth
                            size="large"
                            className={classes.buttonText}
                            startIcon={<Avatar size="small" className={classes.iconGoogle} src={GoogleColorsIcon} />}
                            onClick={renderProps.onClick}
                            disabled={renderProps.disabled}
                          >
                            Iniciar con Google
                          </Button>
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Box
                    mt={1}
                    mb={1}
                  >
                    <Typography
                      align="center"
                      color="textSecondary"
                      variant="body1"
                    >
                      o con tu cuenta de correo registrada
                    </Typography>
                  </Box>
                  <TextField
                    error={Boolean(touched.email && errors.email)}
                    fullWidth
                    helperText={touched.email && errors.email}
                    label="Usuario o Correo electrónico"
                    margin="normal"
                    name="email"
                    onChange={(event) => setUsername(event.currentTarget.value)}
                    type="email"
                    value={username}
                    variant="outlined"
                  />
                  <TextField
                    error={Boolean(touched.password && errors.password)}
                    fullWidth
                    helperText={touched.password && errors.password}
                    label="Contraseña"
                    margin="normal"
                    name="password"
                    onChange={(event) => setPassword(event.currentTarget.value)}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <Box>
                    <Collapse in={message.show}>
                      <Alert
                        className={classes.alert}
                        severity={message.type}
                        action={(
                          <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => { setMessage({ show: false, content: '' }); }}
                          >
                            <CloseIcon fontSize="inherit" />
                          </IconButton>
                        )}
                      >
                        {message.content}
                      </Alert>
                    </Collapse>
                  </Box>
                  <Box my={2}>
                    <Button
                      color="primary"
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      onClick={handleLogIn}
                    >
                      {APP_TEXTS.LOGIN_BTN}
                    </Button>
                  </Box>
                  <Typography
                    color="textSecondary"
                    variant="body1"
                  >
                    <Link
                      component={RouterLink}
                      to={APP_CONFIG.ROUTE_FORGOT_PASSWORD}
                      variant="h6"
                    >
                      {APP_TEXTS.FORGOT_PASSWORD_BTN}
                    </Link>
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body1"
                  >
                    ¿No tienes cuenta?
                    {' '}
                    <Link
                      component={RouterLink}
                      to="/register"
                      variant="h6"
                    >
                      {APP_TEXTS.REGISTER_BTN}
                    </Link>
                  </Typography>
                </form>
              )}
            </Formik>
          </Container>
        </Box>
      )}
    </Page>
  );
};

export default LoginView;
