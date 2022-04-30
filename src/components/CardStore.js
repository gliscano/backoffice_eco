import React from 'react';
import PropTypes from 'prop-types';
// Material IU and Icons
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  Link,
  makeStyles,
  Typography,
} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import InstagramIcon from '@material-ui/icons/Instagram';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
// Language
import APP_TEXTS from 'src/language/lang_ES';

const useStyles = makeStyles((theme) => ({
  avatar: {
    borderColor: theme.palette.blueGrey.main,
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
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  }
}));

const CardStore = ({
  item,
  storeData,
  handleEdit,
  handleDelete
}) => {
  const classes = useStyles();

  return (
    <Card
      key={item.store_id}
      className={classes.card}
    >
      <CardHeader
        title={item.name}
        className={classes.cardHeader}
        avatar={(
          <Avatar
            src={storeData.urlImageLogo}
            className={classes.avatar}
          >
            {String(item.name).slice(0, 1).toUpperCase()}
          </Avatar>
        )}
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
          {item.instagram && (
            <Grid
              item
              md={6}
              xs={12}
              justifyContent="center"
            >
              <InstagramIcon />
              {' '}
              <Link
                href={`https://www.instagram.com/${item.instagram}/`}
                color="inherit"
                target="_blank"
                rel="noopener"
              >
                {item.instagram}
              </Link>
            </Grid>
          )}
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
  );
};

CardStore.propTypes = {
  item: PropTypes.object,
  storeData: PropTypes.object,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func
};

export default CardStore;
