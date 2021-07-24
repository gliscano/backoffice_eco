// React
import React, { useState } from 'react';
// Router
import { Link as RouterLink } from 'react-router-dom';
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
// tools, validations
import * as Yup from 'yup';
import { Formik } from 'formik';
// components
import Page from 'src/components/Page';
// services Api
import UserServiceApi from 'src/services/UserServiceApi';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1)
  }
}));

const RegisterView = () => {
  // state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [policy, setPolicy] = useState(false);
  // hook
  const classes = useStyles(false);
  // communitation instance
  const userServiceApi = new UserServiceApi();

  /* const goTo = () => {
    const path = '/home/dashboard';
    console.log(path);
    // props.history.push(path);
  }; */

  const handleRegister = (event) => {
    event.preventDefault();

    const params = {
      name: firstName,
      lastname: lastName,
      username: userName,
      email,
      password
    };

    userServiceApi.create(params);
  };

  return (
    <Page
      className={classes.root}
      title="Registrate"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email,
              firstName,
              lastName,
              userName,
              password,
              policy
            }}
            validationSchema={
              Yup.object().shape({
                email: Yup.string().email(APP_TEXTS.REQUIRED_MAIL)
                  .max(255).required(APP_TEXTS.VALIDATE_MAIL),
                firstName: Yup.string().max(70).required(APP_TEXTS.REQUIRED_NAME),
                lastName: Yup.string().max(70).required(APP_TEXTS.REQUIRED_LASTNAME),
                userName: Yup.string().max(255).required(APP_TEXTS.REQUIRED_USERNAME),
                password: Yup.string().min(8).required(APP_TEXTS.REQUIRED_REGISTER_PASSWORD),
                policy: Yup.boolean().oneOf([true], APP_TEXTS.REQUIRED_POLICY)
              })
            }
          >
            {({
              errors,
              isSubmitting,
              touched
            }) => (
              <form>
                <Box mb={1}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    Registrate
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Crea una nueva cuenta y comienza a Gestionar tu Tienda!!!
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.firstName && errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                  label="Nombre"
                  margin="none"
                  name="firstName"
                  onChange={(event) => setFirstName(event.currentTarget.value)}
                  value={firstName}
                  variant="outlined"
                  style={{ width: '49%', marginRight: '1%', marginBottom: '2%' }}
                />
                <TextField
                  error={Boolean(touched.lastName && errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  label="Apellido"
                  margin="none"
                  name="lastName"
                  onChange={(event) => setLastName(event.currentTarget.value)}
                  value={lastName}
                  variant="outlined"
                  style={{ width: '50%' }}
                />
                <TextField
                  error={Boolean(touched.lastName && errors.lastName)}
                  fullWidth
                  helperText={touched.userName && errors.userName}
                  label="Nombre de Usuario"
                  margin="none"
                  name="userName"
                  onChange={(event) => setUserName(event.currentTarget.value)}
                  value={userName}
                  variant="outlined"
                  style={{ marginBottom: '2%' }}
                />
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Correo electrónico"
                  margin="none"
                  name="email"
                  onChange={(event) => setEmail(event.currentTarget.value)}
                  type="email"
                  value={email}
                  variant="outlined"
                  style={{ marginBottom: '2%' }}
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Contraseña"
                  margin="none"
                  name="password"
                  onChange={(event) => setPassword(event.currentTarget.value)}
                  type="password"
                  value={password}
                  variant="outlined"
                  style={{ marginBottom: '1%' }}
                />
                <Box
                  alignItems="center"
                  display="flex"
                  ml={-1}
                >
                  <Checkbox
                    checked={policy}
                    name="policy"
                    onChange={() => setPolicy(!policy)}
                  />
                  <Typography
                    color="textSecondary"
                    variant="body1"
                  >
                    He leído los
                    {' '}
                    <Link
                      color="primary"
                      component={RouterLink}
                      to="#"
                      underline="always"
                      variant="h6"
                    >
                      Términos y Condiciones
                    </Link>
                    {Boolean(touched.policy && errors.policy) && (
                      <FormHelperText error>
                        {errors.policy}
                      </FormHelperText>
                    )}
                  </Typography>
                </Box>
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    onClick={handleRegister}
                  >
                    Registrarme
                  </Button>
                </Box>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  ¿Ya estas registrado?
                  {' '}
                  <Link
                    component={RouterLink}
                    to="/login"
                    variant="h6"
                  >
                    Inicia Sesión
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

export default RegisterView;
