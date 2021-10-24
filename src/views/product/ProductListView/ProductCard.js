// React
import React from 'react';
// Props and classes
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Material IU and Icons
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import LabelOffIcon from '@material-ui/icons/LabelOffRounded';
import DeleteIcon from '@material-ui/icons/Delete';
// Language
import APP_TEXTS from 'src/language/lang_ES';
// utils
// import APP_UTILS from 'src/config/app.utils';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0px 1px 8px -3px rgba(69,90,100,0.8)'
  },
  item: {
    width: '100%',
    alignItems: 'left',
    display: 'block'
  },
  statsIcon: {
    marginRight: theme.spacing(1)
  },
  header: {
    padding: theme.spacing(1)
  },
  details: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(1)
  },
  imageLarge: {
    width: '240px',
    height: '150px',
    minHeight: '100%',
    backgroundSize: 'contain',
    padding: theme.spacing(1),
  },
  inactive: {
    border: '1px solid #F75B4A',
    opacity: 0.6,
  },
  stock: {
    backgroundColor: theme.palette.green.light,
    color: theme.palette.text.primary,
  },
  outStock: {
    backgroundColor: theme.palette.red.light,
    color: theme.palette.text.white,
  },
  actions: {
    justifyContent: 'space-between',
    paddingTop: 0,
  },
}));

const ProductCard = ({
  className,
  product,
  callbackEdit,
  callbackActive,
  callbackDelete,
  ...rest
}) => {
  const classes = useStyles();

  const handleEdit = (prod) => {
    callbackEdit(prod);
  };

  const handleActive = (prod) => {
    callbackActive(prod);
  };

  const handleDelete = (prod) => {
    callbackDelete(prod);
  };

  const getStock = (stock) => {
    let label = APP_TEXTS.STOCK_LABEL;
    if (stock !== 1000000) {
      label = (stock <= 0) ? APP_TEXTS.STOCK_OUT_LABEL : `${label}: ${stock} ${APP_TEXTS.STOCK_AVAILABLE}`;
    }
    return label;
  };

  const setFormatCurrency = (value) => {
    // return APP_UTILS.currencyFormat(number);
    const currencyFormat = new Intl.NumberFormat('id', {
      style: 'currency',
      currency: 'USD'
    }).format(value);

    return currencyFormat;
  };

  const getFirstImage = (url) => {
    let newURL = [];
    if (url) {
      newURL = url.split(',');
    }

    return (newURL.length > 0 && newURL[0]);
  };

  return (
    <Card
      className={clsx(classes.root, className, (product.status === 'inactive' ? classes.inactive : ''))}
      {...rest}
    >
      <CardContent className={classes.details}>
        <CardMedia
          image={getFirstImage(product.url_photos)}
          className={classes.imageLarge}
        />
        <Grid
          container
          justify="space-between"
          spacing={2}
        >
          <Grid
            className={classes.item}
            xs={12}
            item
          >
            <Typography
              color="primary"
              variant="h5"
              gutterBottom
            >
              {product.title}
            </Typography>
            <Typography
              color="primary"
              variant="h6"
              display="block"
            >
              {`${APP_TEXTS.PRICE_LABEL}: ${setFormatCurrency(product.price)}`}
            </Typography>
            <br />
            <Chip
              size="small"
              label={(getStock(product.stock))}
              className={(product.stock > 0) ? classes.stock : classes.outStock}
            />
            <Typography
              color="textSecondary"
              variant="body2"
              gutterBottom
            >
              {(product.status === 'active')
                ? APP_TEXTS.ACTIVE_PRODUCT_LABEL : APP_TEXTS.INACTIVE_PRODUCT_LABEL}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions className={classes.actions}>
        <Button
          key="delete"
          size="small"
          aria-label="Delete Product"
          onClick={() => handleDelete(product)}
          startIcon={<DeleteIcon />}
        >
          {APP_TEXTS.DELETE_BTN}
        </Button>
        <Button
          key="status"
          size="small"
          variant="outlined"
          aria-label="status"
          onClick={() => handleActive(product)}
          startIcon={<LabelOffIcon />}
        >
          {(product.status === 'active') ? APP_TEXTS.DISABLE_ITEM : APP_TEXTS.ACTIVE_ITEM}
        </Button>
        <Button
          key="edit"
          size="small"
          variant="outlined"
          color="secondary"
          aria-label="Editar"
          onClick={() => handleEdit(product)}
          startIcon={<CreateIcon />}
        >
          {APP_TEXTS.EDIT_BTN}
        </Button>
      </CardActions>
    </Card>
  );
};

ProductCard.propTypes = {
  className: PropTypes.string,
  product: PropTypes.object.isRequired,
  callbackEdit: PropTypes.func,
  callbackActive: PropTypes.func,
  callbackDelete: PropTypes.func
};

export default ProductCard;
