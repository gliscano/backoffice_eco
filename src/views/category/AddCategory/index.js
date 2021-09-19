// React
import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
// Redux and Router
// import { useSelector } from 'react-redux';
// import { useHistory } from 'react-router';
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
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
// Language
import APP_TEXTS from 'src/language/lang_ES';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(0)
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
  break: {
    width: '100%',
    height: '3%'
  },
  textField: {
    border: 'none',
  }
}));

const AddCategory = ({
  className,
  editMode,
  itemToEdit,
  category,
  callbackAddEdit,
  callbackCancel,
}) => {
  // State
  const [selectedCategory, setCategorySelected] = useState('');
  const [selectedSubcateg, setSubCategSelected] = useState('');
  const [titleComponent, setTitleComponent] = useState(APP_TEXTS.ADD_ONE_CATEGORY);
  const [registeredCategory, setRegisteredCategory] = useState(false);
  const [initialized, setInitialized] = useState(false);
  // Hooks
  const classes = useStyles();

  const goBack = () => {
    callbackCancel();
  };

  const setTitle = () => {
    if (editMode && itemToEdit.addSubcategory) {
      setTitleComponent(APP_TEXTS.ADD_ONE_SUBCATEGORY);
    } else if (editMode && !itemToEdit.parent_category_id) {
      setTitleComponent(APP_TEXTS.TITLE_UPDATE_CATEGORY);
    } else if (editMode && itemToEdit.parent_category_id >= 0) {
      setTitleComponent(APP_TEXTS.TITLE_UPDATE_SUBCATEGORY);
    }
  };

  const setDataToEdit = (dataToEdit) => {
    if (!dataToEdit) { return; }

    if (!dataToEdit.parent_category_id) {
      setCategorySelected(dataToEdit.name);
    } else {
      setRegisteredCategory(true);
      setSubCategSelected(dataToEdit.name);
      setCategorySelected(dataToEdit.categoryName);
    }
  };

  const addCategory = () => {
    if (!selectedCategory) { return false; }

    const addedItem = category.filter((item) => {
      return item.name === selectedCategory;
    });

    if (addedItem.length) {
      setRegisteredCategory(true);
      // mostrar mensaje
      return false;
    }

    let newItem = {
      name: selectedCategory,
      parent_category_id: null,
    };

    if (editMode) {
      newItem = { ...itemToEdit };
      newItem.name = selectedCategory;
      newItem.update = true;
    }

    callbackAddEdit(newItem);
    setSubCategSelected('');
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

      if (editMode) {
        //
      }
      callbackAddEdit(newSubCateg);
    }

    return true;
  };

  const updateCategorySelected = (e) => {
    const value = (e.target && e.target.value) || ((typeof e === 'string') ? e : '');

    const addedItem = category.filter((item) => {
      return item.name === value;
    });

    setCategorySelected(value);
    setRegisteredCategory(!!addedItem.length);
    setSubCategSelected('');
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

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      setTitle();
      if (editMode && itemToEdit && itemToEdit.name) {
        setDataToEdit(itemToEdit);
      }
    }
  }, []);

  return (
    <form
      autoComplete="off"
      noValidate
      className={clsx(classes.root, className)}
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
            <CardHeader title={titleComponent} />
            <CardContent className={classes.toolbarContainer}>
              <Box className={classes.toolbar}>
                <Grid
                  container
                  xs={12}
                  spacing={1}
                >
                  <Grid
                    item
                    xs={12}
                    md={7}
                  >
                    <Autocomplete
                      id="category"
                      size="small"
                      freeSolo
                      options={category}
                      getOptionLabel={(option) => option.name}
                      inputValue={selectedCategory}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={APP_TEXTS.ADD_ONE_CATEGORY}
                          variant="outlined"
                          onChange={updateCategorySelected}
                        />
                      )}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={5}
                  >
                    <Button
                      fullWidth
                      color="primary"
                      variant="contained"
                      onClick={addCategory}
                      disabled={registeredCategory}
                    >
                      {(editMode) ? APP_TEXTS.EDIT_BTN : APP_TEXTS.ADD_CATEGORY}
                    </Button>
                  </Grid>
                  <div className={classes.break} />
                  <Grid
                    item
                    xs={12}
                    md={7}
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
                    xs={12}
                    md={5}
                  >
                    <Button
                      fullWidth
                      color="primary"
                      variant="contained"
                      disabled={!registeredCategory}
                      onClick={addSubcategory}
                    >
                      {(editMode) ? APP_TEXTS.EDIT_BTN : APP_TEXTS.ADD_SUBCATEGORY}
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
        </Grid>
      </Grid>
    </form>
  );
};

AddCategory.propTypes = {
  className: PropTypes.string,
  category: PropTypes.array,
  editMode: PropTypes.bool,
  itemToEdit: PropTypes.object,
  callbackAddEdit: PropTypes.func,
  callbackCancel: PropTypes.func,
};

export default AddCategory;
