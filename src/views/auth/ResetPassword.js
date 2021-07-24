// React
import React, { useState } from 'react';
// Redux and Router
import { useHistory } from 'react-router-dom';
// tools
import * as Yup from 'yup';
import { Formik } from 'formik';
// Material IU and Icons
import {
  Box,
  Button,
  Container,
  // Grid,
  // Link,
  TextField,
  Typography,
  makeStyles,
  // Avatar,
  // Collapse,
  // IconButton,
} from '@material-ui/core';
// components
import Page from 'src/components/Page';
// Languages
import APP_TEXTS from 'src/language/lang_ES';
// Services Api
import LoginServiceApi from 'src/services/LoginServiceApi';
// Constants of Configuration
import APP_CONFIG from 'src/config/app.config';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  mainContainer: {
    // border: 'solid 1px #D1D4D9',
    borderRadius: '5px',
    paddingTop: '15px',
    paddingBottom: '15px',
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

const ResetPassword = () => {
  // states
  const [username, setUsername] = useState('');
  // hooks
  const classes = useStyles();
  const history = useHistory();
  // communication instances
  const loginServiceApi = new LoginServiceApi();

  const goTo = () => {
    const path = APP_CONFIG.ROUTE_HOME;
    history.push(path);
  };

  const goBack = () => {
    history.goBack();
  };

  async function processResultLogin(response) {
    // TO DO
    console.log(response);
    goTo();
  }

  async function handleLogIn(event) {
    event.preventDefault();

    const credentials = {
      username,
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
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Ingresa un correo electrónico válido').max(255).required('Correo electrónico es requerido'),
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
                    {APP_TEXTS.FORGOT_PASSWORD_TITLE}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    {APP_TEXTS.FORGOT_PASSWORD_MESSAGE}
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Correo electrónico"
                  margin="normal"
                  name="email"
                  onChange={(event) => setUsername(event.currentTarget.value)}
                  type="email"
                  value={username}
                  variant="outlined"
                />
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
                    {APP_TEXTS.RESET_PASSWORD}
                  </Button>
                  <Button
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={goBack}
                  >
                    {APP_TEXTS.BACK_BTN}
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default ResetPassword;
