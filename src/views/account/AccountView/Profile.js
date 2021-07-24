import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Avatar, Box, Button, Card, CardActions, CardContent, Divider, Typography, makeStyles
} from '@material-ui/core';
import APP_TEXTS from 'src/language/lang_ES';

const user = {
  avatar: '',
  city: '',
  country: '',
  name: '',
};

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 100,
    width: 100
  }
}));

const Profile = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
        >
          <Avatar
            className={classes.avatar}
            src={user.avatar}
          />
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h3"
          >
            {user.name}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body1"
          >
            {`${user.city} - ${user.country}`}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          color="primary"
          fullWidth
          variant="text"
        >
          {APP_TEXTS.LOAD_PROFILE_USER}
        </Button>
      </CardActions>
    </Card>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
