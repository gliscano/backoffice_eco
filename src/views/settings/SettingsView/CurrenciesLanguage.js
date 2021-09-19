// React
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
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
import AvailableCurrencies from 'src/config/Currencies';

const useStyles = makeStyles(({
  root: {},
  item: {
    display: 'flex',
    flexDirection: 'column'
  }
}));

const CurrenciesLanguage = ({ className, ...rest }) => {
  const classes = useStyles();
  // const [selectedCurrency, setCurrency] = useState('Dolar Americano');
  // const [selectedLanguage, setLanguage] = useState('Español');

  return (
    <form
      className={clsx(classes.root, className)}
      {...rest}
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
                value="Dolar"
                // onChange={setCurrency}
                variant="outlined"
                size="small"
              >
                {AvailableCurrencies.map((item) => (
                  <MenuItem
                    key={item.name}
                    value={item}
                    disabled={!item.active}
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
                value="Español"
                defaultValue=""
                // onChange={setLanguage}
                variant="outlined"
                size="small"
              >
                <MenuItem
                  key="español"
                  value="Español"
                >
                  Español
                </MenuItem>
                <MenuItem
                  key="english"
                  value="English"
                  disabled="true"
                >
                  English
                </MenuItem>
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
          >
            {APP_TEXTS.SAVE_CHANGES_BTN}
          </Button>
        </Box>
      </Card>
    </form>
  );
};

CurrenciesLanguage.propTypes = {
  className: PropTypes.string
};

export default CurrenciesLanguage;
