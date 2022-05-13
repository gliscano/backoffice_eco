// React
import React, { useState } from 'react';
// Redux
import { useDispatch, useSelector } from 'react-redux';
import { SET_LANG_CURRENCY_DATA } from 'src/store/action_types';
// Material UI and Icons
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  makeStyles,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core';
// Language
import APP_TEXTS from 'src/language/lang_ES';
// Constants - Currencies
import Currencies from 'src/config/Currencies';
import Locales from 'src/config/locales';
import useAlertBar from 'src/hooks/useAlertBar';

const useStyles = makeStyles(({
  root: {},
  item: {
    display: 'flex',
    flexDirection: 'column'
  }
}));

const CURRENCY_DEFAULT = Currencies.filter((element) => element.id === 'USD');
const LOCALE_DEFAULT = Locales.filter((element) => element.id === 'es-ES');

const CurrenciesLanguage = () => {
  const classes = useStyles();
  const [currencySelected, setCurrencySelected] = useState(CURRENCY_DEFAULT[0]);
  const [languageSelected, setLanguageSelected] = useState(LOCALE_DEFAULT[0]);
  // Hooks
  const appData = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const { showAlert } = useAlertBar();

  const handleChangeCurrency = (data) => {
    setCurrencySelected(data);
  };

  const handleChangeLang = (data) => {
    setLanguageSelected(data);
  };

  const handleAlertBar = (typeAlert, message) => {
    showAlert({ typeAlert, message });
  };

  const handleSaveChanges = () => {
    const { alert, ...rest } = appData;
    const data = {
      ...rest,
      currencyId: currencySelected.id,
      languageId: languageSelected.id
    };

    console.log('SAVE DATA', data);

    dispatch({
      type: SET_LANG_CURRENCY_DATA,
      payload: data
    });

    const typeAlert = 'success';
    const message = APP_TEXTS.MESSAGE_UPDATE_SETTINGS;

    handleAlertBar(typeAlert, message);
  };

  return (
    <form
      className={classes.root}
    >
      <Card>
        <CardHeader
          title={APP_TEXTS.CURRENCY_AND_LANGUAGE_TITLE}
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={6}
            wrap="wrap"
          >
            <Grid
              className={classes.item}
              item
              md={4}
              sm={6}
              xs={12}
            >
              <Typography
                color="textPrimary"
                gutterBottom
                variant="h6"
              >
                {APP_TEXTS.CURRENCIES}
              </Typography>
              <TextField
                fullWidth
                select
                required
                name="currency"
                value={currencySelected.name}
                variant="outlined"
                size="small"
              >
                {Currencies.map((item) => (
                  <MenuItem
                    key={item.id}
                    value={item.name}
                    disabled={!item.active}
                    onClick={() => handleChangeCurrency(item)}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid
              className={classes.item}
              item
              md={4}
              sm={6}
              xs={12}
            >
              <Typography
                color="textPrimary"
                gutterBottom
                variant="h6"
              >
                {APP_TEXTS.LANGUAGE}
              </Typography>
              <TextField
                fullWidth
                select
                required
                name="language"
                value={languageSelected.name}
                variant="outlined"
                size="small"
              >
                {Locales.map((item) => (
                  <MenuItem
                    key={item.id}
                    value={item.name}
                    disabled={!item.active}
                    onClick={() => handleChangeLang(item)}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
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
            onClick={handleSaveChanges}
          >
            {APP_TEXTS.SAVE_CHANGES_BTN}
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default CurrenciesLanguage;
