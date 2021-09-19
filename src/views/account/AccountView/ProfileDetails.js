// React
import React, { useState } from 'react';
// Redux
import { useSelector } from 'react-redux';
// Props and Classes
import clsx from 'clsx';
import PropTypes from 'prop-types';
// Material UI and icons
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    marginRight: theme.spacing(2)
  },
}));

const ProfileDetails = ({ className, ...rest }) => {
  const classes = useStyles();
  const userData = useSelector((state) => state.userData);
  const [values, setValues] = useState({
    firstName: (userData.name) || '',
    lastName: (userData.lastname) || '',
    email: (userData.email) || '',
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  return (
    <form
      autoComplete="off"
      noValidate
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
        <CardHeader
          subheader="Actualiza tu información personal"
          title="Perfil de Usuario"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Nombre"
                name="firstName"
                onChange={handleChange}
                required
                disabled
                value={values.firstName}
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
                label="Apellido"
                name="lastName"
                onChange={handleChange}
                required
                disabled
                value={values.lastName}
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
                label="Correo electrónico"
                name="email"
                onChange={handleChange}
                required
                disabled
                value={values.email}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string
};

export default ProfileDetails;
