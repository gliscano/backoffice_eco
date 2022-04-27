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
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core';
// components
import Page from 'src/components/Page';
// Languages
import APP_TEXTS from 'src/language/lang_ES';
// Services Api
import LoginServiceApi from 'src/services/LoginServiceApi';
import { useDispatch, useSelector } from 'react-redux';
import { HIDE_ALERT, SET_ALERT_DATA } from 'src/store/action_types';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: 'calc(100% - 64px)',
    margin: 'auto',
    paddingBottom: theme.spacing(3),
    overflow: 'hidden',
    paddingTop: theme.spacing(3),
    position: 'absolute',
    width: '100%',
  },
  mainContainer: {
    backgroundColor: theme.palette.background.white,
    borderRadius: '5px',
    paddingTop: '16px',
    paddingBottom: '16px',
    boxShadow: '0px 1px 8px -3px rgba(69,90,100,0.8)',
  },
  buttonText: {
    textTransform: 'none',
  },
  alert: {
    boxShadow: '0px 1px 8px -3px rgba(69,90,100,0.8)',
  },
  passMessage: {
    paddingTop: '8px'
  }
}));

const ResetPassword = () => {
  // states
  const [username, setUsername] = useState('');
  // hooks
  const classes = useStyles();
  const history = useHistory();
  const appData = useSelector((state) => state.app);
  const dispatch = useDispatch();
  // communication instances
  const loginServiceApi = new LoginServiceApi();

  const goTo = () => {
    // const path = APP_CONFIG.ROUTE_MAIN;
    // history.push(path);
  };

  const closeAlert = () => {
    dispatch({
      type: HIDE_ALERT,
      payload: ''
    });
  };

  const handleAlertBar = (status, message) => {
    const { alert, ...rest } = appData;
    const alertData = {
      ...alert,
      open: true,
      message,
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

  const goBack = () => {
    history.goBack();
  };

  function processResult(response) {
    let status = true;
    let message = APP_TEXTS.RESET_PASSWORD_MESSAGE;

    console.log('response', response);

    if (typeof response.data === 'string') {
      status = false;
      message = (response.data === 'invalid email') ? APP_TEXTS.INVALID_EMAIL : APP_TEXTS.ERR_UNKNOWN;
    }

    handleAlertBar(status, message);
    goTo();
  }

  async function handleReset(event) {
    event.preventDefault();

    const credentials = {
      username,
    };

    loginServiceApi.forgetPasswordRequest(credentials)
      .then((response) => {
        if (response) {
          processResult(response);
        }
      })
      .catch((error) => {
        processResult(error);
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
              email: Yup.string().email(APP_TEXTS.INVALID_EMAIL)
                .max(255).required(APP_TEXTS.REQUIRED_MAIL),
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
                    className={classes.passMessage}
                  >
                    {APP_TEXTS.FORGOT_PASSWORD_MESSAGE}
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label={APP_TEXTS.MAIL}
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
                    onClick={handleReset}
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
