import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Card, CardContent, Grid, makeStyles, CardHeader, CardMedia, TextField, InputAdornment
} from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import LoyaltyIcon from '@material-ui/icons/Loyalty';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  statsItem: {
    alignItems: 'center',
    display: 'flex',
    padding: theme.spacing(1)
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
    width: '100%',
    height: '100%',
    minHeight: '100%',
    backgroundSize: 'contain',
    padding: theme.spacing(1),
  },
}));

const ProductCard = ({ className, product, ...rest }) => {
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader
        title={product.title}
        className={classes.header}
        // subheader={product.description}
      />
      <CardContent className={classes.details}>
        <CardMedia
          image={product.media}
          className={classes.imageLarge}
        />
        <Grid
          container
          justify="space-between"
          spacing={2}
        >
          <Grid
            className={classes.statsItem}
            item
          >
            <TextField
              fullWidth
              disabled
              value={product.price}
              label="Precio"
              name="price"
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon
                      className={classes.statsIcon}
                      color="action"
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid
            className={classes.statsItem}
            item
          >
            <TextField
              fullWidth
              disabled
              label="Precio Promocional"
              name="price"
              value={product.promotionPrice}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LoyaltyIcon
                      className={classes.statsIcon}
                      color="action"
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid
            className={classes.statsItem}
            item
          >
            <TextField
              fullWidth
              disabled
              label="Stock Disponible"
              name="stock"
              value={`Cant.: ${product.stock}`}
              variant="outlined"
              size="small"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

ProductCard.propTypes = {
  className: PropTypes.string,
  product: PropTypes.object.isRequired
};

export default ProductCard;
