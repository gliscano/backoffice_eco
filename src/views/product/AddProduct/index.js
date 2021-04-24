import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import DropZone from 'src/components/dropZonePreview';
import {
  Box, Button, Card, CardContent, CardHeader, Divider, Grid, TextField, makeStyles,
} from '@material-ui/core';
import theme from 'src/theme';

const useStyles = makeStyles(() => ({
  root: {
    margin: theme.spacing(2)
  },
  drop: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
}));

const AddProduct = ({ className, ...rest }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    codeProduct: '',
    idTienda: '',
    photo: '',
    title: '',
    description: '',
    price: '',
    promotionPrice: '',
    stock: '',
    category: '',
    subcategory: '',
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
      <Grid
        container
        md={8}
        xs={12}
      >
        <Card>
          <CardHeader
            title="Agregar Nuevo Producto"
          />
          <Divider />
          <CardContent>
            <Box
              className={classes.drop}
            >
              <DropZone />
            </Box>
            <Box>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  md={4}
                  xs={12}
                >
                  <TextField
                    fullWidth
                    label="Código de Producto"
                    name="codeProduct"
                    onChange={handleChange}
                    required
                    value={values.codeProduct}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={4}
                  xs={12}
                >
                  <TextField
                    fullWidth
                    label="Titulo del Producto"
                    name="title"
                    onChange={handleChange}
                    required
                    value={values.title}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={4}
                  xs={12}
                >
                  <TextField
                    fullWidth
                    label="Descripción"
                    name="description"
                    onChange={handleChange}
                    required
                    value={values.description}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={4}
                  xs={12}
                >
                  <TextField
                    fullWidth
                    label="Precio"
                    name="price"
                    onChange={handleChange}
                    type="number"
                    value={values.price}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={4}
                  xs={12}
                >
                  <TextField
                    fullWidth
                    label="Precio Promocional"
                    name="promotionPrice"
                    onChange={handleChange}
                    value={values.promotionPrice}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={4}
                  xs={12}
                >
                  <TextField
                    fullWidth
                    label="Stock"
                    name="stock"
                    onChange={handleChange}
                    value={values.stock}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={4}
                  xs={12}
                >
                  <TextField
                    fullWidth
                    label="Categoría"
                    name="category"
                    onChange={handleChange}
                    required
                    value={values.category}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={4}
                  xs={12}
                >
                  <TextField
                    fullWidth
                    label="Subcategoría"
                    name="subcategory"
                    onChange={handleChange}
                    value={values.subcategory}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
          <Divider />
          <Box
            display="flex"
            justifyContent="flex-end"
            p={2}
          >
            <Button
              color="primary"
              variant="contained"
            >
              Guardar
            </Button>
          </Box>
        </Card>
      </Grid>
    </form>
  );
};

AddProduct.propTypes = {
  className: PropTypes.string
};

export default AddProduct;
