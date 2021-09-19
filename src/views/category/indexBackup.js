// React
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
// Redux and Router
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
// Material IU and Icons
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles,
  ListItem,
  ListItemText,
  List,
  ListSubheader,
  ListItemSecondaryAction,
  IconButton,
  ListItemIcon,
} from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteIcon from '@material-ui/icons/Delete';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import SubcategoryItemIcon from '@material-ui/icons/SubdirectoryArrowRight';
// Language
import APP_TEXTS from 'src/language/lang_ES';
// Components
import AlertBar from 'src/components/AlertBar';
// Services Api
import CategoryServiceApi from 'src/services/CategoryServiceApi';
import { Autocomplete } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2)
  },
  button: {
    width: '95%',
    textAlign: 'center',
    margin: '4% 2%',
  },
  buttonBack: {
    width: '95%',
    textAlign: 'center',
    margin: '1%',
  },
  toolbarContainer: {
    padding: 0,
  },
  toolbar: {
    display: 'flex',
    padding: theme.spacing(2),
    boxShadow: '0px 1px 8px -3px rgba(69,90,100,0.8)',
  },
  textFieldCateg: {
    margin: '1% 0',
  },
  break: {
    width: '100%',
    height: '4%',
  },
  listContainer: {
    margin: '1% 0',
  },
  columnLeft: {
    flexBasis: '50%',
    textAlign: 'left',
  },
  columnRight: {
    flexBasis: '50%',
    textAlign: 'right',
  },
  accordionSummary: {
    backgroundColor: theme.palette.blueGrey.light,
    minHeight: '30px important',
    alignContent: 'center',
    alignItems: 'center',
  },
  accordionTitle: {
    alignItems: 'center',
    margin: 'auto 0px',
  },
  boxSubcategory: {
    margin: theme.spacing(0),
    padding: theme.spacing(0),
  },
  categoryList: {
    border: '1px solid #EDF0F5',
    borderRadius: '5px',
  },
  subcategoryList: {
    width: '98%',
    marginLeft: theme.spacing(2),
  },
  active: {
    border: '3px solid #ffffff',
    borderLeft: '2px solid #455a64',
    backgroundColor: theme.palette.blueGrey.light,
  },
  activeSub: {
    backgroundColor: theme.palette.blueGrey.light,
    border: '3px solid #ffffff',
    borderLeft: '2px solid #455a64',
    width: '98%',
    marginLeft: theme.spacing(2),
  }
}));

const AddCategory = ({ className, ...rest }) => {
  // State
  const [category, setCategory] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [editCategory, setEditCategory] = useState(false);
  const [itemToEdit, setItemToEdit] = useState({});
  const [selectedCategory, setCategorySelected] = useState('');
  const [selectedSubcateg, setSubCategSelected] = useState('');
  const [registeredCategory, setRegisteredCategory] = useState(false);

  // Hooks
  const classes = useStyles();
  const history = useHistory();
  const userData = useSelector((state) => state.userData);
  // communication instances
  const categoryServiceApi = new CategoryServiceApi();

  const goBack = () => {
    history.goBack();
  };

  // Scrolling to top page
  const moveToTop = () => {
    const container = document.getElementById('mainContainer');
    if (container) {
      window.scrollBy({
        top: 0,
        left: 0
      });
    }
  };

  const processResult = (data) => {
    const newItem = new Array(data);
    let newCategory = null;

    if (!data.parent_category_id) {
      newCategory = [...category, ...newItem];
    } else if (data.parent_category_id) {
      newCategory = category.map((item) => {
        if (item.category_id === data.parent_category_id) {
          const subcategories = [...item.subcategories];
          item.subcategories = [...subcategories, ...newItem];
        }
        return item;
      });
    }

    if (newCategory) {
      setCategory(newCategory);
      setRegisteredCategory(true);
    }

    setEditCategory(false);
    setItemToEdit({});
    setSubCategSelected('');
    setCategorySelected('');
  };

  const addEditItem = (itemCategory) => {
    itemCategory.token = userData.token;

    categoryServiceApi.createUpdateCategory(itemCategory)
      .then((response) => {
        if (response && response.data) {
          processResult(response.data);
        }
      });
  };

  const getCategories = () => {
    categoryServiceApi.getCategories(userData.token)
      .then((response) => {
        if (response && response.data) {
          setCategory(response.data);
        } else {
          setCategory([]);
        }
      });

    return false;
  };

  const addCategory = () => {
    if (!selectedCategory) { return false; }

    const addedItem = category.filter((item) => {
      return item.name === selectedCategory;
    });

    if (addedItem.length) {
      setRegisteredCategory(true);
      return false;
    }

    let newItem = {
      name: selectedCategory,
      parent_category_id: null,
    };

    if (editCategory && itemToEdit.category_id) {
      newItem.update = true;
      newItem = {
        ...itemToEdit,
        ...newItem
      };
    }

    addEditItem(newItem);
    return true;
  };

  const addSubcategory = () => {
    if (!selectedSubcateg) { return false; }

    let parentCategory = category.filter((item) => (item.name === selectedCategory));

    if (parentCategory && parentCategory.length) {
      parentCategory = parentCategory.shift();
      const parentCategoryId = parentCategory.category_id;
      const updateItem = parentCategory.subcategories.filter(
        (item) => (item.name === selectedSubcateg)
      );

      const newSubCateg = {
        name: selectedSubcateg,
        parent_category_id: parentCategoryId,
        update: updateItem && !!updateItem.length,
      };

      addEditItem(newSubCateg);
    }

    return true;
  };

  const deleteCategory = (itemCategory) => {
    itemCategory.token = userData.token;

    categoryServiceApi.deleteCategory(itemCategory)
      .then((response) => {
        if (response) {
          getCategories();
          setCategorySelected('');
          setRegisteredCategory(false);
        }
      });
  };

  const deleteSubcategory = (itemSubcategory) => {
    itemSubcategory.token = userData.token;

    categoryServiceApi.deleteCategory(itemSubcategory)
      .then((response) => {
        if (response && response.data) {
          processResult(response.data);
        }
      });
  };

  const updateCategorySelected = (e) => {
    const value = (e.target && e.target.value) || ((typeof e === 'string') ? e : '');

    const addedItem = category.filter((item) => {
      return item.name === value;
    });

    setCategorySelected(value);
    setRegisteredCategory(!!addedItem.length);
    setSubCategSelected('');

    if (typeof e === 'string') {
      setEditCategory(true);
      setItemToEdit(addedItem.shift());
    }

    // Scrolling to top page
    moveToTop();
  };

  const updateSubcategSelected = (e) => {
    if (e.target && e.target.value) {
      setSubCategSelected(e.target.value);
    } else if (e.categ && e.subcateg) {
      setCategorySelected(e.categ);
      setSubCategSelected(e.subcateg);
    } else {
      setSubCategSelected('');
    }

    // Scrolling to top page
    moveToTop();
  };

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      getCategories();
    }
  }, []);

  return (
    <form
      autoComplete="off"
      noValidate
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Grid
        id="mainContainer"
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
              title="Categoría y Subcategoría"
            />
            <CardContent className={classes.toolbarContainer}>
              <Box className={classes.toolbar}>
                <Grid
                  container
                  xs={12}
                >
                  <Grid
                    item
                    xs={12}
                    md={9}
                  >
                    <Autocomplete
                      id="category"
                      freeSolo
                      options={category}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={APP_TEXTS.ADD_ONE_CATEGORY}
                          variant="outlined"
                          onChange={updateCategorySelected}
                        />
                      )}
                    />
                    {/* <TextField
                      id="grouped-Category"
                      size="small"
                      variant="outlined"
                      label={(registeredCategory)
                        ? APP_TEXTS.CATEGORY_REGISTERED : APP_TEXTS.ADD_ONE_CATEGORY}
                      fullWidth
                      className={classes.textFieldCateg}
                      value={selectedCategory}
                      onChange={updateCategorySelected}
                    /> */}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={3}
                  >
                    <Button
                      className={classes.button}
                      color="primary"
                      variant="contained"
                      onClick={addCategory}
                      disabled={registeredCategory}
                      startIcon={<AddBoxIcon />}
                    >
                      {(editCategory) ? APP_TEXTS.EDIT_BTN : APP_TEXTS.ADD_CATEGORY}
                    </Button>
                  </Grid>
                  <div
                    className={classes.break}
                  />
                  <Grid
                    item
                    xs={12}
                    md={8}
                  >
                    <TextField
                      id="grouped-Category"
                      size="small"
                      variant="outlined"
                      label="Agregar Subcategoría"
                      fullWidth
                      className={classes.textFieldCateg}
                      disabled={!registeredCategory}
                      value={selectedSubcateg}
                      onChange={updateSubcategSelected}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={3}
                  >
                    <Button
                      size="medium"
                      className={classes.button}
                      fullWidth
                      color="primary"
                      variant="contained"
                      disabled={!registeredCategory}
                      onClick={addSubcategory}
                      startIcon={<AddBoxIcon />}
                    >
                      {APP_TEXTS.ADD_SUBCATEGORY}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
              <Box
                display="flex"
                justifyContent="center"
              >
                <Button
                  variant="text"
                  onClick={goBack}
                  className={classes.buttonBack}
                >
                  {APP_TEXTS.BACK_BTN}
                </Button>
              </Box>
            </CardContent>
            <Divider />
          </Card>
          <Card
            className={classes.listContainer}
          >
            <CardContent>
              <List
                component="nav"
                aria-labelledby="list-categories"
                subheader={(
                  <ListSubheader component="div" id="list-categories">
                    {APP_TEXTS.CATEGORIES_AVAILABLE}
                  </ListSubheader>
                )}
              >
                {category.map((item) => (
                  <>
                    <ListItem
                      button
                      id={item.category_id}
                      key={`itemCategory_${item.name}`}
                      aria-controls={`category_${item.name}`}
                      onClick={() => updateCategorySelected(item.name)}
                      className={(selectedCategory === item.name)
                        ? classes.active : classes.categoryList}
                    >
                      <ListItemText primary={item.name} />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => updateCategorySelected(item.name)}
                        >
                          <EditRoundedIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => deleteCategory(item)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {item.subcategories.map((subcateg) => (
                      <ListItem
                        button
                        dense
                        id={subcateg.category_id}
                        key={`itemSubcategory_${subcateg.name}`}
                        aria-controls={`subcategory_${subcateg.name}`}
                        onClick={() => updateSubcategSelected(
                          { categ: item.name, subcateg: subcateg.name, }
                        )}
                        className={(selectedSubcateg === subcateg.name)
                          ? classes.activeSub : classes.subcategoryList}
                      >
                        <ListItemIcon>
                          <SubcategoryItemIcon />
                        </ListItemIcon>
                        <ListItemText primary={subcateg.name} />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => deleteSubcategory(subcateg)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </>
                ))}
                {(category.length === 0) && (
                  <ListItem
                    id="emptyCategorie"
                    key="emptyCategorie"
                    aria-controls="emptyCategorie"
                  >
                    No tienes Categorias cargadas... Vamos, comienza ahora!
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
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
    </form>
  );
};

AddCategory.propTypes = {
  className: PropTypes.string
};

export default AddCategory;
