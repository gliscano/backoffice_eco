// React
import React from 'react';
// Props and classes
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Material IU and Icons
import {
  Box,
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
    display: 'flex',
    flexDirection: 'column',
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
    borderRadius: '5px',
    border: `1px solid ${theme.palette.blueGrey.main}`,
    marginRight: theme.spacing(1),
  },
  inactive: {
    border: '1px solid #F75B4A',
    opacity: 0.6,
  },
  detailsProduct: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: '15px',
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

const CardProduct = ({
  appData,
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
      currency: appData.currencyId || 'USD',
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
          alt={`${product.title} photography`}
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
              variant="subtitle2"
              gutterBottom
            >
              {product.title}
            </Typography>
            <Typography
              color="primary"
              variant="body2"
              display="block"
            >
              {`${APP_TEXTS.PRICE_LABEL}: ${setFormatCurrency(product.price)}`}
            </Typography>
            <Box className={classes.detailsProduct}>
              <Typography
                color="textSecondary"
                variant="caption"
                gutterBottom
              >
                {(product.status === 'active')
                  ? APP_TEXTS.ACTIVE_PRODUCT_LABEL : APP_TEXTS.INACTIVE_PRODUCT_LABEL}
              </Typography>
              <Chip
                size="small"
                label={(getStock(product.stock))}
                className={(product.stock > 0) ? classes.stock : classes.outStock}
              />
            </Box>
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

CardProduct.propTypes = {
  appData: PropTypes.object.isRequired,
  className: PropTypes.string,
  product: PropTypes.object.isRequired,
  callbackEdit: PropTypes.func,
  callbackActive: PropTypes.func,
  callbackDelete: PropTypes.func
};

export default CardProduct;
