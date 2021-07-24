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
import SubcategoryItemIcon from '@material-ui/icons/SubdirectoryArrowRight';
// Language
import APP_TEXTS from 'src/language/lang_ES';
// Components
import AlertBar from 'src/components/AlertBar';
// Services Api
import CategoryServiceApi from 'src/services/CategoryServiceApi';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2)
  },
  button: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  toolbar: {
    display: 'flex',
    padding: theme.spacing(2),
    boxShadow: '0px 1px 8px -3px rgba(69,90,100,0.8)',
  },
  bar: {
    display: 'flex',
    marginBottom: theme.spacing(2),
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
    backgroundColor: theme.palette.blueGrey.light
  },
  subcategoryList: {
    marginLeft: theme.spacing(2),
  },
  active: {
    borderLeft: '2px solid #455a64',
    color: theme.palette.primary.main,
  }
}));

const Category = ({ className, ...rest }) => {
  // State
  const [category, setCategory] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [selectedCategory, setCategorySelected] = useState('');
  const [selectedSubcateg, setSubCategSelected] = useState('');
  const [registeredCategory, setRegisteredCategory] = useState(false);
  /* const [alert, setAlert] = useState({
    open: false,
    message: '',
    button: APP_TEXTS.ACCEPT_BTN,
    severity: 'success',
    callback: null,
  }); */

  // Hooks
  const classes = useStyles();
  const history = useHistory();
  const userData = useSelector((state) => state.userData);
  // communication instances
  const categoryServiceApi = new CategoryServiceApi();

  const goBack = () => {
    history.goBack();
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

      setSubCategSelected('');
    }

    if (newCategory) {
      setCategory(newCategory);
      setRegisteredCategory(true);
    }

    /* if (resp && resp.status === 'active') {
      handleAlertBar(true);

      setTimeout(() => {
        closeAlert();
        goBack();
      }, 2000);
      return true;
    }

    handleAlertBar(false); */
  };

  const addItem = (itemCategory) => {
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
    if (!selectedCategory) {
      return false;
    }

    const addedItem = category.filter((item) => {
      return item.name === selectedCategory;
    });

    if (addedItem.length) {
      setRegisteredCategory(true);
      return false;
    }

    const newItem = {
      name: selectedCategory,
      parent_category_id: null,
    };

    addItem(newItem);
    return true;
  };

  const addSubcategory = () => {
    if (!selectedSubcateg) {
      return false;
    }

    let parentCategoryId = category.filter((item) => (item.name === selectedCategory));

    if (parentCategoryId && parentCategoryId.length) {
      parentCategoryId = parentCategoryId[0].category_id;

      const newSubCateg = {
        name: selectedSubcateg,
        parent_category_id: parentCategoryId,
      };

      addItem(newSubCateg);
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
    const value = e.target.value || e.target.innerText || '';

    const addedItem = category.filter((item) => {
      return item.name === value;
    });

    setCategorySelected(value);
    setRegisteredCategory(!!addedItem.length);

    if (e.target.innerText) {
      setSubCategSelected('');
    }
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
  };

  /* const closeAlert = () => {
    setAlert({
      ...alert,
      open: false,
      message: '',
      callback: null,
    });
  }; */

  /* const handleAlertBar = (status) => {
    setAlert({
      ...alert,
      open: true,
      message: (status) ? APP_TEXTS.MESSAGE_CREATE_STORE : APP_TEXTS.CREATE_STORE_ERROR,
      severity: (status) ? 'success' : 'error',
      callback: closeAlert,
    });
  }; */

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
            <CardContent
              spacing={1}
            >
              <Card className={classes.toolbar}>
                <Grid
                  container
                  xs={12}
                >
                  <Grid
                    item
                    xs={12}
                    className={classes.bar}
                  >
                    <Grid
                      item
                      xs={9}
                    >
                      <TextField
                        id="grouped-Category"
                        size="small"
                        variant="outlined"
                        label={(registeredCategory) ? 'Categoría registrada' : 'Agregar una Categoría'}
                        fullWidth
                        value={selectedCategory}
                        onChange={updateCategorySelected}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={3}
                    >
                      <Button
                        size="medium"
                        className={classes.button}
                        color="primary"
                        variant="contained"
                        onClick={addCategory}
                        disabled={registeredCategory}
                        startIcon={<AddBoxIcon />}
                      >
                        {APP_TEXTS.ADD_CATEGORY}
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    className={classes.bar}
                  >
                    <Grid
                      item
                      xs={8}
                    >
                      <TextField
                        id="grouped-Category"
                        size="small"
                        variant="outlined"
                        label="Agregar Subcategoría"
                        fullWidth
                        disabled={!registeredCategory}
                        value={selectedSubcateg}
                        onChange={updateSubcategSelected}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={3}
                    >
                      <Button
                        size="medium"
                        className={classes.button}
                        color="primary"
                        variant="contained"
                        disabled={!registeredCategory}
                        onClick={addSubcategory}
                        startIcon={<AddBoxIcon />}
                      >
                        Subcategoría
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </CardContent>
            <Card>
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
                        onClick={updateCategorySelected}
                        activeClassName={classes.active}
                        className={classes.categoryList}
                      >
                        <ListItemText primary={item.name} />
                        <ListItemSecondaryAction>
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
                          activeClassName={classes.active}
                          className={classes.subcategoryList}
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
            <Divider />
            <Box
              display="flex"
              justifyContent="flex-end"
              p={1}
            >
              <Button
                variant="text"
                onClick={goBack}
                className={classes.button}
              >
                {APP_TEXTS.BACK_BTN}
              </Button>
            </Box>
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

Category.propTypes = {
  className: PropTypes.string
};

export default Category;
