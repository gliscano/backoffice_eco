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
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import LabelOffIcon from '@material-ui/icons/LabelOffRounded';
// Language
import APP_TEXTS from 'src/language/lang_ES';

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
    border: '1px solid red',
    opacity: 0.6,
  },
  actions: {
    justifyContent: 'space-between',
  },
}));

const imageDefault = '/static/images/products/box_products.png';

const ProductCard = ({
  className,
  product,
  callbackEdit,
  callbackActive,
  ...rest
}) => {
  const classes = useStyles();

  const handleEdit = (prod) => {
    callbackEdit(prod);
  };

  const handleActive = (prod) => {
    callbackActive(prod);
  };

  return (
    <Card
      className={clsx(classes.root, className, (product.status === 'inactive' ? classes.inactive : ''))}
      {...rest}
    >
      <CardContent className={classes.details}>
        <CardMedia
          image={product.media || imageDefault}
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
              variant="button"
              display="block"
              gutterBottom
            >
              Precio:
              {' '}
              {product.price}
            </Typography>
            <Typography
              color="textSecondary"
              variant="body2"
              gutterBottom
            >
              {`Stock.: ${product.stock} unid.`}
            </Typography>
            <Typography
              color="textSecondary"
              variant="body2"
              gutterBottom
            >
              {product.status}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions className={classes.actions}>
        <Button
          key="status"
          size="small"
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
          {APP_TEXTS.EDIT_PRODUCT_BTN}
        </Button>
      </CardActions>
    </Card>
  );
};

ProductCard.propTypes = {
  className: PropTypes.string,
  product: PropTypes.object.isRequired,
  callbackEdit: PropTypes.func,
  callbackActive: PropTypes.func
};

export default ProductCard;
