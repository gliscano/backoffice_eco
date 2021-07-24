// React
import React, { useEffect, useState } from 'react';
// Redux and Router
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { SET_STORE_DATA } from 'src/store/action_types';
// Props and classes
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Material IU and Icon
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  makeStyles,
  Typography,
  // IconButton,
} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import AlternateEmailRoundedIcon from '@material-ui/icons/AlternateEmailRounded';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
// Language
import APP_TEXTS from 'src/language/lang_ES';
// Services Api
import StoreServiceApi from 'src/services/StoreServiceApi';
// Components
import AlertBar from 'src/components/AlertBar';
import ConfirmationDialog from 'src/components/ConfirmationDialog';
// Config
import APP_CONFIG from 'src/config/app.config';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    padding: theme.spacing(1),
    flexGrow: 1,
  },
  card: {
    maxWidth: '100%',
    boxShadow: '0px 1px 8px -3px rgba(69,90,100,0.8)',
  },
  cardHeader: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
    cursor: 'pointer',
  },
  actions: {
    justifyContent: 'space-between',
  },
  description: {
    padding: theme.spacing(1),
    textAlign: 'justify',
  }
}));

const ProfileStore = ({ className, ...rest }) => {
  const classes = useStyles();
  const userData = useSelector((state) => state.userData);
  const storeData = useSelector((state) => state.storeData);
  const storeServiceApi = new StoreServiceApi();
  const [initialized, setInitialized] = useState(false);
  const [stores, setStores] = useState([]);
  const [currentStoreID, setCurrentStoreID] = useState(null);
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
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
      message: (status) ? APP_TEXTS.MESSAGE_DELETE_STORE : APP_TEXTS.DELETE_STORE_ERROR,
      severity: (status) ? 'success' : 'error',
      callback: closeAlert,
    });
  };

  const handleDelete = (event) => {
    if (event === 'clickaway') {
      return;
    }

    const storeId = (event.currentTarget && event.currentTarget.id);
    if (!openDialogConfirm && storeId) {
      setOpenDialogConfirm(true);
      setCurrentStoreID(storeId);
    }
  };

  const goTo = (path) => {
    history.push(path);
  };

  const handleEdit = (event, edit) => {
    if (event === 'clickaway') {
      return;
    }

    const storeId = (event.currentTarget && event.currentTarget.id);
    let store = stores && stores.length ? stores.filter((s) => {
      return s.store_id === Number(storeId);
    }) : null;

    store = (store && store.length) ? store[store.length - 1] : null;
    if (store) {
      dispatch({
        type: SET_STORE_DATA,
        payload: store
      });

      if (edit) {
        const path = APP_CONFIG.ROUTE_EDIT_STORE;
        goTo(path);
      }
    }
  };

  const initDataStores = (response) => {
    if (response && response.stores) {
      setStores(response.stores);
    }
  };

  const getDataStores = () => {
    storeServiceApi.getStores(userData.token)
      .then((response) => {
        initDataStores(response);
      });
  };

  const deleteStore = (storeId) => {
    storeServiceApi.deleteStore(userData.token, storeId)
      .then((response) => {
        handleAlertBar(response);
        if (response) {
          getDataStores();
        }
      })
      .catch((err) => console.log(err));
  };

  const deleteCallback = (resp) => {
    setOpenDialogConfirm(false);

    if (resp && currentStoreID) {
      deleteStore(currentStoreID);
    }
  };

  useEffect(() => {
    if (!initialized) {
      getDataStores();
      setInitialized(true);
    }
  }, []);

  return (
    <Box
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Grid
        container
        spacing={1}
      >
        {stores.map((item) => (
          <Grid
            item
            key={item.store_id || item.key}
            sm={4}
            xs={12}
          >
            <Card
              key={item.store_id}
              className={classes.card}
            >
              <CardHeader
                title={item.name}
                className={classes.cardHeader}
              />
              <CardMedia
                className={classes.media}
                image="/static/images/store/yourBanner.jpg"
                title={storeData.title}
                id={item.store_id}
                onClick={(e) => handleEdit(e, true)}
              />
              <CardContent>
                <Grid
                  container
                  xs={12}
                >
                  <Grid
                    item
                    md={6}
                    xs={12}
                    justifyContent="center"
                  >
                    <WhatsAppIcon />
                    {' '}
                    {item.phone}
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                    justifyContent="center"
                  >
                    <AlternateEmailRoundedIcon />
                    {' '}
                    {item.instagram}
                  </Grid>
                </Grid>
                <Grid
                  className={classes.description}
                >
                  <Typography variant="caption" color="textSecondary">
                    {item.description}
                  </Typography>
                </Grid>
              </CardContent>
              <CardActions className={classes.actions}>
                { /* {item.store_id !== storeData.store_id && (
                  <Button
                    key="storeInactive"
                    size="small"
                    aria-label="tiendaInactiva"
                    id={item.store_id}
                    onClick={(e) => handleEdit(e, false)}
                    startIcon={<CheckBoxOutlineBlankRoundedIcon />}
                  >
                    Seleccionar
                  </Button>
                )}
                {item.store_id === storeData.store_id && (
                  <Button
                    key="storeActived"
                    size="small"
                    aria-label="tiendaActiva"
                    id={item.store_id}
                  >
                    <CheckBoxRoundedIcon />
                  </Button>
                )} */ }
                <Button
                  key="delete"
                  size="small"
                  aria-label="Eliminar"
                  id={item.store_id}
                  onClick={(e) => handleDelete(e)}
                  startIcon={<DeleteRoundedIcon />}
                >
                  {APP_TEXTS.DELETE_BTN}
                </Button>
                <Button
                  key="edit"
                  size="small"
                  id={item.store_id}
                  variant="outlined"
                  color="secondary"
                  aria-label={APP_TEXTS.EDIT_STORE_BTN}
                  onClick={(e) => handleEdit(e, true)}
                  startIcon={<CreateIcon />}
                >
                  {APP_TEXTS.EDIT_STORE_BTN}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {openDialogConfirm
      && (
      <ConfirmationDialog
        open={openDialogConfirm}
        title={APP_TEXTS.CONFIRMATION_TITLE}
        message={APP_TEXTS.CONFIRM_DELETE_STORE}
        primaryButton={APP_TEXTS.DELETE_BTN}
        secondaryButton={APP_TEXTS.CANCEL_BTN}
        parentCallback={deleteCallback}
      />
      )}
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
    </Box>
  );
};

ProfileStore.propTypes = {
  className: PropTypes.string
};

export default ProfileStore;
