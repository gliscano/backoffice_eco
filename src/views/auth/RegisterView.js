// React
import React, { useState } from 'react';
// Router
import { Link as RouterLink, useHistory } from 'react-router-dom';
// Material IU
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormHelperText,
  Link,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
// language
import APP_TEXTS from 'src/language/lang_ES';
// components
import Page from 'src/components/Page';
import AlertBar from 'src/components/AlertBar';
// services Api
import UserServiceApi from 'src/services/UserServiceApi';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    margin: 'auto',
    padding: '1% 0',
    backgroundColor: theme.palette.background.dark,
  },
}));

const RegisterView = () => {
  // state
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    confirmEmail: '',
    password: '',
    policy: false,
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    confirmEmail: '',
    password: '',
    policy: '',
    confirmed: false,
  });
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    button: APP_TEXTS.ACCEPT_BTN,
    severity: '',
    callback: null,
  });
  // hook
  const classes = useStyles(false);
  const history = useHistory();
  // communitation instance
  const userServiceApi = new UserServiceApi();

  const goTo = () => {
    const path = '/welcome';
    history.push(path);
  };

  const handleError = (name, value) => {
    setErrors((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

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

  const handleChange = (event) => {
    const value = (event.target.name === 'policy') ? !values.policy : event.target.value;
    setValues({
      ...values,
      [event.target.name]: value
    });

    // clear error
    handleError(event.target.name, '');
  };

  const validateData = () => {
    let confirmedError = false;

    const helperText = {
      firstName: APP_TEXTS.REQUIRED_NAME,
      lastName: APP_TEXTS.REQUIRED_LASTNAME,
      userName: APP_TEXTS.REQUIRED_USERNAME,
      email: APP_TEXTS.REQUIRED_MAIL,
      confirmEmail: APP_TEXTS.REQUIRED_MAIL,
      password: APP_TEXTS.REQUIRED_PASSWORD,
      policy: APP_TEXTS.REQUIRED_POLICY,
    };

    Object.entries(values).forEach(([name, value]) => {
      let text = '';
      if (value === '') {
        text = helperText[name];
        confirmedError = true;
      } else if (name === 'email' || name === 'confirmEmail') {
        const expReg = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);
        if (!(expReg.test(value))) {
          confirmedError = true;
          text = APP_TEXTS.VALIDATE_MAIL;
        }
      } else if (name === 'password' && value.length < 8) {
        confirmedError = true;
        text = APP_TEXTS.REQUIRED_PASSWORD_LOG;
      }
      // set Error
      handleError(name, text);
    });

    if (!confirmedError && values.email !== values.confirmEmail) {
      confirmedError = true;
      handleError('confirmEmail', APP_TEXTS.EMAIL_NOT_MATCH);
    }

    return confirmedError;
  };

  const processResult = (response) => {
    if (response && response.data && response.data.username) {
      goTo();
    } else {
      const paramsAlert = {
        message: 'ERROR DE ALGO',
        typeAlert: 'error'
      };

      // Show error alert
      handleAlertBar(paramsAlert);
    }
  };

  const handleRegister = (event) => {
    event.preventDefault();
    if (validateData()) { return; }

    const params = {
      name: values.firstName,
      lastname: values.lastName,
      username: values.userName,
      email: values.email,
      password: values.password
    };

    userServiceApi.create(params)
      .then((response) => processResult(response));
  };

  return (
    <Page
      className={classes.root}
      title={APP_TEXTS.SIGN_UP_TITLE}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <form>
            <Box mb={1}>
              <Typography
                color="textPrimary"
                variant="h2"
              >
                {APP_TEXTS.SIGN_UP_TITLE}
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                {APP_TEXTS.SIGN_UP_SUBTITLE}
              </Typography>
            </Box>
            <TextField
              error={errors.firstName !== ''}
              helperText={errors.firstName}
              label={APP_TEXTS.NAME}
              margin="none"
              name="firstName"
              onChange={handleChange}
              value={values.firstName}
              variant="outlined"
              style={{ width: '49%', marginRight: '1%', marginBottom: '2%' }}
            />
            <TextField
              error={errors.lastName !== ''}
              helperText={errors.lastName}
              label={APP_TEXTS.LAST_NAME}
              margin="none"
              name="lastName"
              onChange={handleChange}
              value={values.lastName}
              variant="outlined"
              style={{ width: '50%' }}
            />
            <TextField
              fullWidth
              error={errors.userName !== ''}
              helperText={errors.userName}
              label={APP_TEXTS.USERNAME}
              margin="none"
              name="userName"
              onChange={handleChange}
              value={values.userName}
              variant="outlined"
              style={{ marginBottom: '2%' }}
            />
            <TextField
              fullWidth
              error={errors.email !== ''}
              helperText={errors.email}
              label={APP_TEXTS.MAIL}
              margin="none"
              name="email"
              onChange={handleChange}
              type="email"
              value={values.email}
              variant="outlined"
              style={{ marginBottom: '2%' }}
            />
            <TextField
              fullWidth
              error={errors.confirmEmail !== ''}
              helperText={errors.confirmEmail}
              label={APP_TEXTS.CONFIRM_EMAIL}
              margin="none"
              name="confirmEmail"
              onChange={handleChange}
              type="email"
              value={values.confirmEmail}
              variant="outlined"
              style={{ marginBottom: '2%' }}
            />
            <TextField
              fullWidth
              error={errors.password !== ''}
              helperText={errors.password}
              label={APP_TEXTS.PASSWORD}
              margin="none"
              name="password"
              onChange={handleChange}
              type="password"
              value={values.password}
              variant="outlined"
              style={{ marginBottom: '1%' }}
            />
            <Box
              alignItems="center"
              display="flex"
              ml={-1}
            >
              <Checkbox
                checked={values.policy}
                name="policy"
                onChange={handleChange}
              />
              <Typography
                color="textSecondary"
                variant="body1"
              >
                {APP_TEXTS.AGREE_TERM}
                {' '}
                <Link
                  color="primary"
                  component={RouterLink}
                  to="#"
                  underline="always"
                  variant="h6"
                >
                  {APP_TEXTS.TERMS_AND_CONDITIONS}
                </Link>
                {Boolean(errors.policy) && (
                  <FormHelperText error>
                    {errors.policy}
                  </FormHelperText>
                )}
              </Typography>
            </Box>
            <Box my={1}>
              <Button
                color="primary"
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                onClick={handleRegister}
              >
                {APP_TEXTS.SIGN_UP_BTN}
              </Button>
            </Box>
            <Typography
              color="textSecondary"
              variant="body1"
            >
              {APP_TEXTS.ALREADY_REGISTERED}
              {' '}
              <Link
                component={RouterLink}
                to="/login"
                variant="h6"
              >
                {APP_TEXTS.LOGIN_BTN}
              </Link>
            </Typography>
          </form>
        </Container>
      </Box>
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

export default RegisterView;
