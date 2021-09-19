// React
import React from 'react';
// Props and classes
import PropTypes from 'prop-types';
// Material IU and Icons
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteIcon from '@material-ui/icons/Delete';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import SubcategoryItemIcon from '@material-ui/icons/SubdirectoryArrowRight';
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
  cardHeader: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(0),
    borderBottom: '1px solid #cccccc'
  },
  cardContent: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(0)
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
    marginRight: theme.spacing(2)
  },
  labelSubcateg: {
    padding: theme.spacing(0),
  },
}));

// const imageDefault = '/static/images/products/box_products.png';

const ProductCard = ({
  className,
  item,
  callbackAdd,
  callbackEdit,
  callbackDelete,
  ...rest
}) => {
  const classes = useStyles();

  const handleEdit = (itemToEdit, nameCateg) => {
    const data = itemToEdit;
    if (nameCateg) { data.categoryName = nameCateg; }

    callbackEdit(data);
  };

  const handleDelete = (itemToDelete) => {
    callbackDelete(itemToDelete);
  };

  // const getFirstImage = (url) => {
  //   let newURL = [];
  //   if (url) {
  //     newURL = url.split(',');
  //   }

  //   return (newURL.length > 0) ? newURL[0] : imageDefault;
  // };

  return (
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
        <Card
          {...rest}
          id={item.category_id}
          key={`itemCategory_${item.name}`}
          aria-controls={`category_${item.name}`}
          className={classes.root}
        >
          <CardHeader
            title={item.name}
            action={(
              <Box className={classes.actions}>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleEdit(item)}
                >
                  <EditRoundedIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(item)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
            className={classes.cardHeader}
          />
          <CardContent className={classes.cardContent}>
            <List className={classes.labelSubcateg}>
              <ListItem
                dense
                id="subcategoryAvailable"
                key="labelSubcategory"
              >
                <ListItemText
                  primary={((item.subcategories.length > 0)
                    ? APP_TEXTS.SUBCATEGORIES_AVAILABLE : APP_TEXTS.SUBCATEGORIES_NOT_AVAILABLE)}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="Add category"
                    onClick={() => callbackAdd(item)}
                  >
                    <AddBoxIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              {item.subcategories.map((subcateg) => (
                <ListItem
                  dense
                  id={subcateg.category_id}
                  key={`itemSubcategory_${subcateg.name}`}
                  aria-controls={`subcategory_${subcateg.name}`}
                >
                  <ListItemIcon>
                    <SubcategoryItemIcon />
                  </ListItemIcon>
                  <ListItemText primary={subcateg.name} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="Edit"
                      onClick={() => handleEdit(subcateg, item.name)}
                    >
                      <EditRoundedIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(subcateg)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

ProductCard.propTypes = {
  className: PropTypes.string,
  item: PropTypes.object.isRequired,
  callbackAdd: PropTypes.func,
  callbackEdit: PropTypes.func,
  callbackDelete: PropTypes.func
};

export default ProductCard;
