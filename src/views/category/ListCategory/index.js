// React
import React, { useEffect, useState } from 'react';
// Redux and Router
import { useSelector } from 'react-redux';
// Material IU and Icons
import {
  Box,
  Container,
  Dialog,
  Grid,
  makeStyles,
  Slide,
} from '@material-ui/core';
// Language
import APP_TEXTS from 'src/language/lang_ES';
// Services Api
import CategoryServiceApi from 'src/services/CategoryServiceApi';
// Components
import Page from 'src/components/Page';
import AlertBar from 'src/components/AlertBar';
import Toolbar from './Toolbar';
import CategoryCard from './CategoryCard';
import AddCategory from '../AddCategory';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2)
  },
  toolbar: {
    height: '20%',
  },
  emptyList: {
    textAlign: 'center',
    margin: 'auto',
  },
  imageContainer: {
    textAlign: 'center',
    marginBottom: theme.spacing(2),
  }
}));

const TransitionDialog = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ListCategory = () => {
  // State
  const [category, setCategory] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [itemToEdit, setItemToEdit] = useState({});
  // Hooks
  const classes = useStyles();
  const userData = useSelector((state) => state.userData);
  // communication instances
  const categoryServiceApi = new CategoryServiceApi();

  const showDialog = () => {
    setOpenDialog(true);
  };

  const hideDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setItemToEdit({});
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

  const deleteCategory = (params) => {
    if (!params.token || !params.category_id) { return; }

    categoryServiceApi.deleteCategory(params)
      .then((response) => {
        if (response) {
          getCategories();
        }
      });
  };

  const deleteSubcategory = (params) => {
    if (!params.token || !params.category_id) { return; }

    categoryServiceApi.deleteSubcategory(params)
      .then((response) => {
        if (response) {
          getCategories();
        }
      });
  };

  const addEditCategory = (itemCategory) => {
    if (!itemCategory) { return; }
    itemCategory.token = userData.token;

    categoryServiceApi.createUpdateCategory(itemCategory)
      .then((response) => {
        if (response && response.data) {
          getCategories();
        }
      });
  };

  const callbackAddCategory = (data) => {
    if (data && data.category_id) {
      data.addSubcategory = true;
      setEditMode(true);
      setItemToEdit(data);
    } else {
      setEditMode(false);
      setItemToEdit({});
    }

    showDialog();
  };

  const callbackDelete = (item) => {
    console.log(item);
    if (!item) { return; }

    const params = {
      token: userData.token,
      category_id: item.category_id,
    };

    if (item.parent_category_id) {
      deleteSubcategory(params);
    } else {
      deleteCategory(params);
    }
  };

  const callbackEditCategory = (data) => {
    data.addSubcategory = false;
    setEditMode(true);
    setItemToEdit(data);
    showDialog();
  };

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      getCategories();
    }
  }, []);

  return (
    <Page
      className={classes.root}
      title={APP_TEXTS.CATEROGY}
    >
      <Container>
        <Toolbar
          className={classes.toolbar}
          totalCategories={category.length}
          callbackAddCategory={callbackAddCategory}
        />
        <Box mt={2}>
          <Grid
            container
            spacing={1}
          >
            {category.map((item) => (
              <Grid
                item
                key={`Category_${item.category_id}`}
                md={4}
                xs={12}
              >
                <CategoryCard
                  key={item.category_id}
                  item={item}
                  className={classes.productCard}
                  callbackAdd={callbackAddCategory}
                  callbackEdit={callbackEditCategory}
                  callbackDelete={callbackDelete}
                />
              </Grid>
            ))}
            {(category.length === 0) && (
              <Grid
                item
                xs={12}
              >
                <Box className={classes.emptyList}>
                  <Box className={classes.imageContainer}>
                    <h4>IMAGE</h4>
                  </Box>
                  <h4>No tienes Categorias cargadas... Vamos, comienza ahora!</h4>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Container>
      {(openDialog) && (
      <Dialog
        open={openDialog}
        keepMounted
        disableBackdropClick
        TransitionComponent={TransitionDialog}
        onClose={hideDialog}
        aria-labelledby="alert_dialog_add_category"
        aria-describedby="alert_dialog_add_category"
      >
        <AddCategory
          category={category}
          editMode={editMode}
          itemToEdit={itemToEdit}
          callbackAddEdit={addEditCategory}
          callbackCancel={hideDialog}
        />
      </Dialog>
      )}
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
    </Page>
  );
};

export default ListCategory;
