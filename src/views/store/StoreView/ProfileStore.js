import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Card,
  CardContent,
  Typography,
  makeStyles,
  CardHeader,
  IconButton,
  CardMedia,
  Grid,
  Box,
  CardActions,
} from '@material-ui/core';
import StoreServiceApi from 'src/services/StoreServiceApi';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import ConfirmationDialog from 'src/components/ConfirmationDialog';
import AlertBar from 'src/components/AlertBar';
import APP_TEXTS from 'src/language/lang_ES';
import { SET_STORE_DATA } from 'src/store/action_types';
import CreateIcon from '@material-ui/icons/Create';
import AlternateEmailRoundedIcon from '@material-ui/icons/AlternateEmailRounded';
import PhoneIcon from '@material-ui/icons/Phone';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import CheckBoxRoundedIcon from '@material-ui/icons/CheckBoxRounded';
import CheckBoxOutlineBlankRoundedIcon from '@material-ui/icons/CheckBoxOutlineBlankRounded';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    padding: theme.spacing(1),
    flexGrow: 1,
  },
  card: {
    maxWidth: '100%'
  },
  cardHeader: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
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
        const path = '/app/editStore';
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
            md={4}
            xs={12}
          >
            <Card
              key={item.store_id}
              className={classes.card}
            >
              <CardHeader
                title={item.name}
                subheader={item.title}
                className={classes.cardHeader}
                action={(
                  <CardActions>
                    {item.store_id !== storeData.store_id && (
                      <IconButton
                        key="storeInactive"
                        size="small"
                        aria-label="tiendaInactiva"
                        id={item.store_id}
                        onClick={(e) => handleEdit(e, false)}
                      >
                        <CheckBoxOutlineBlankRoundedIcon />
                      </IconButton>
                    )}
                    {item.store_id === storeData.store_id && (
                      <IconButton
                        key="storeActived"
                        size="small"
                        aria-label="tiendaActiva"
                        id={item.store_id}
                      >
                        <CheckBoxRoundedIcon />
                      </IconButton>
                    )}
                    <IconButton
                      key="edit"
                      size="small"
                      id={item.store_id}
                      aria-label="Editar"
                      onClick={(e) => handleEdit(e, true)}
                    >
                      <CreateIcon />
                    </IconButton>
                    <IconButton
                      key="delete"
                      size="small"
                      aria-label="Borrar"
                      id={item.store_id}
                      onClick={(e) => handleDelete(e)}
                    >
                      <DeleteRoundedIcon />
                    </IconButton>
                  </CardActions>
                )}
              />
              <CardMedia
                className={classes.media}
                image="/static/images/store/yourBanner.jpg"
                title={storeData.title}
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
                  >
                    <PhoneIcon />
                    {' '}
                    {item.phone}
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
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
