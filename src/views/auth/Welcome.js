// React
import React from 'react';
import PropTypes from 'prop-types';
// Redux and Router
import { useHistory } from 'react-router-dom';
// Material IU and Icons
import {
  Box,
  Button,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
// components
import Page from 'src/components/Page';
// Languages
import APP_TEXTS from 'src/language/lang_ES';
// Images
import WelcomeImage from 'src/assets/image/register/welcome.jpg';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 'calc(100% - 64px)',
    position: 'absolute',
    margin: 'auto',
    backgroundColor: theme.palette.background.dark,
  },
  mainContainer: {
  },
  imageContainer: {
    textAlign: 'center',
    marginBottom: theme.spacing(2),
  },
  iconGoogle: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  iconFacebook: {
    width: theme.spacing(3.5),
    height: theme.spacing(3.5),
  },
  buttonText: {
    textTransform: 'none',
  },
  alert: {
    boxShadow: '0px 1px 8px -3px rgba(69,90,100,0.8)',
  },
}));

const Welcome = ({ username }) => {
  // hooks
  const classes = useStyles();
  const history = useHistory();

  const goBack = () => {
    console.log(username);
    history.push('/');
  };

  return (
    <Page
      className={classes.root}
      title="Welcome"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container
          maxWidth="sm"
          className={classes.mainContainer}
        >
          <Box>
            <Box
              className={classes.imageContainer}
            >
              <img
                src={WelcomeImage}
                width="100%"
                height="auto"
                margin="auto"
                alt="welcome"
              />
            </Box>
            <Typography
              color="textPrimary"
              variant="h2"
            >
              {APP_TEXTS.VERIFY_ACCOUNT_TITLE}
            </Typography>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="body2"
            >
              {APP_TEXTS.VERIFY_ACCOUNT_MESSAGE}
            </Typography>
          </Box>
          <Box my={2}>
            <Button
              color="primary"
              variant="outlined"
              fullWidth
              size="large"
              onClick={goBack}
            >
              {APP_TEXTS.GO_HOME}
            </Button>
          </Box>
        </Container>
      </Box>
    </Page>
  );
};

Welcome.propTypes = {
  username: PropTypes.string,
};

export default Welcome;
