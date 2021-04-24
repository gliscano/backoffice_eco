import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { Formik } from 'formik';
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
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import GoogleLogin from 'react-google-login';
import Page from 'src/components/Page';
import { SET_USER_DATA } from 'src/store/action_types';
import APP_TEXTS from 'src/language/lang_ES';
import CloseIcon from '@material-ui/icons/Close';
import LoginServiceApi from '../../services/LoginServiceApi';
import FacebookIcon from '../../assets/icons/facebook.svg';
import GoogleColorsIcon from '../../assets/icons/google.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  mainContainer: {
    border: 'solid 1px #D1D4D9',
    borderRadius: '5px',
    paddingTop: '15px',
    paddingBottom: '15px',
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
}));

const LoginView = () => {
  const [initialized, setInitialized] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({
    content: '',
    type: 'info', // error, warning, info, success
    show: false,
  });
  const history = useHistory();

  const classes = useStyles();
  const dispatch = useDispatch();
  const loginServiceApi = new LoginServiceApi();

  const goTo = () => {
    const path = '/app/';
    history.push(path);
  };

  const setDataLocalStorage = (data) => {
    localStorage.setItem('cookiesEco', JSON.stringify(data));
  };

  const processResultLogin = (response) => {
    // if login is success, save token
    if (response && response.data) {
      const loginData = {
        userName: username,
        token: response.data.access,
        refresh: response.data.refresh,
        logged: true,
      };

      setMessage({
        show: true,
        type: 'success',
        content: 'Bienvendo',
      });

      dispatch({
        type: SET_USER_DATA,
        payload: loginData
      });

      setDataLocalStorage(loginData);

      setTimeout(() => {
        goTo();
      }, 1000);
    } else {
      setMessage({
        show: true,
        type: 'error',
        content: APP_TEXTS.VALIDATE_CREDENTIALS,
      });
    }
  };

  async function updateToken(token) {
    loginServiceApi.updateTokenRequest(token)
      .then((response) => {
        if (response && response.data) {
          processResultLogin(response);
        }
      });
  }

  const getDataLocalStorage = () => {
    let data = localStorage.getItem('cookiesEco');
    data = (data) ? JSON.parse(data) : null;

    if (data && data.logged && data.refresh) {
      updateToken(data.refresh);
    } else {
      localStorage.setItem('cookiesEco', '');
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
        if (response && response.data) {
          processResultLogin(response);
        }
      });
  }

  return (
    <Page
      className={classes.root}
      title="Login"
    >
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
                    Inicia sesión y comienza a Gestionar tu tienda
                  </Typography>
                </Box>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    xs={6}
                  >
                    <Button
                      fullWidth
                      size="large"
                      className={classes.buttonText}
                      startIcon={<Avatar size="small" className={classes.iconFacebook} src={FacebookIcon} />}
                    >
                      Iniciar con Facebook
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={6}
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
                  mt={3}
                  mb={1}
                >
                  <Typography
                    align="center"
                    color="textSecondary"
                    variant="body1"
                  >
                    o Inicia con tu cuenta de correo registrada
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
                  type="password"
                  value={password}
                  variant="outlined"
                />
                <Box>
                  <Collapse in={message.show}>
                    <Alert
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
                    Iniciar Sesión
                  </Button>
                </Box>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  <Link
                    component={RouterLink}
                    to="/register"
                    variant="h6"
                  >
                    Olvide mi contraseña
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
                    Regístrate
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;
