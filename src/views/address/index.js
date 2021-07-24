// React
import React, { useEffect, useState } from 'react';
// Redux and Router
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { SET_STORE_DATA } from 'src/store/action_types';
// classes and Prop
import clsx from 'clsx';
import PropTypes from 'prop-types';
// Material UI and icons
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  makeStyles,
  MenuItem,
  TextField,
} from '@material-ui/core';
// Languague
import APP_TEXTS from 'src/language/lang_ES';
// Components
import Page from 'src/components/Page';
// services Api
import AddressServiceApi from 'src/services/AddressServiceApi';
import Country from 'src/config/country_VE';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1)
  },
  button: {
    marginRight: theme.spacing(2)
  },
}));

const Address = ({ className, ...rest }) => {
  // hooks
  const userData = useSelector((state) => state.userData);
  const storeData = useSelector((state) => state.storeData);
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();

  // state
  const [initialized, setInitialized] = useState(false);
  const [updateAddress, setUpdateAddress] = useState(false);
  const [values, setValues] = useState({
    addressId: (storeData.addressId) || '',
    city: (storeData.city) || '',
    codePostal: (storeData.codePostal) || '',
    country: (storeData.country) || '',
    propertyId: (storeData.propertyId) || '',
    propertyType: (storeData.propertyType) || '',
    state: (storeData.state) || '',
    street: (storeData.street) || '',
  });
  // communication instance
  const addressServiceApi = new AddressServiceApi();

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const goToBack = () => {
    history.goBack();
  };

  // Set store info in Redux
  const setStoreDataRedux = (data) => {
    if (data) {
      dispatch({
        type: SET_STORE_DATA,
        payload: data
      });
    }
  };

  const setAddressInfo = (data) => {
    const address = (data.length) ? data[0] : data;
    if (!address || !address.address_id) {
      return;
    }

    const mainAddress = {
      addressId: address.address_id,
      city: (address.city) || '',
      postalCode: (address.postal_code) || '',
      country: (address.country) || '',
      propertyId: (address.property_id) || '',
      propertyType: (address.propertyType) || '',
      state: (address.state) || '',
      street: (address.street) || '',
      extraInfo: (address.extra_info) || '',
      ownerType: (address.owner_type) || 'store',
    };

    setValues({
      ...mainAddress,
    });

    setStoreDataRedux(mainAddress);
  };

  const handleAddress = (event) => {
    event.preventDefault();

    const data = {
      addressId: values.addressId,
      city: values.city,
      extraInfo: values.extraInfo,
      ownerId: storeData.store_id,
      postalCode: values.postalCode,
      propertyId: values.idProperty,
      propertyType: 'store',
      state: values.state,
      street: values.street,
      typeUser: 'store', // store or user
      token: userData.token,
      update: updateAddress,
    };

    addressServiceApi.createUpdateAddress(data)
      .then((response) => {
        if (response && response.address) {
          setAddressInfo(response.address);
        }
      });
  };

  // Get store address
  const getAddress = () => {
    const { token } = userData;
    addressServiceApi.getAddress(token)
      .then((response) => {
        if (response && response.address) {
          setAddressInfo(response.address);
          // borrar
          setUpdateAddress(true);
        }
      });
  };

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      getAddress();
    }
  }, []);

  return (
    <form
      autoComplete="off"
      noValidate
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Page
        className={classes.root}
        title="Direcciones"
      >
        <Grid
          container
          md={12}
          xs={12}
        >
          <Grid
            item
            md={12}
            xs={12}
          >
            <Card>
              <CardHeader
                title="Mis Direcciones"
              />
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
                      select
                      label="Estado"
                      name="state"
                      value={values.state}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    >
                      {Country.states.map((state) => (
                        <MenuItem
                          id={state.id}
                          key={state.name}
                          value={state.name}
                        >
                          {state.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      label="Cuidad"
                      name="city"
                      onChange={handleChange}
                      required
                      value={values.city}
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
                      label="Calle"
                      name="street"
                      onChange={handleChange}
                      required
                      value={values.street}
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
                      label="Nro. Casa/Edif"
                      name="idProperty"
                      onChange={handleChange}
                      value={values.propertyId}
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
                      label="Código Postal"
                      name="postalCode"
                      onChange={handleChange}
                      value={values.postalCode}
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
                      label="Info. Adicional (Piso/Apartamento)"
                      name="extraInfo"
                      multiline
                      rows={3}
                      onChange={handleChange}
                      value={values.extraInfo}
                      variant="outlined"
                    />
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
                  variant="contained"
                  onClick={goToBack}
                  className={classes.button}
                >
                  {APP_TEXTS.BACK_BTN}
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleAddress}
                >
                  {APP_TEXTS.SAVE_CHANGES_BTN}
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Page>
    </form>
  );
};

Address.propTypes = {
  className: PropTypes.string
};

export default Address;
