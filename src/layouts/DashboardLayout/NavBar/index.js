import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Link as RouterLink,
  useLocation
} from 'react-router-dom';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import TableChartIcon from '@material-ui/icons/TableChart';
import StoreMallDirectoryRoundedIcon from '@material-ui/icons/StoreMallDirectoryRounded';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ContactsIcon from '@material-ui/icons/Contacts';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import SettingsIcon from '@material-ui/icons/Settings';
import NavItem from './NavItem';

const items = [
  {
    href: '/app/dashboard',
    icon: TableChartIcon,
    title: 'Dashboard'
  },
  {
    href: '/app/store',
    icon: StoreMallDirectoryRoundedIcon,
    title: 'Tienda'
  },
  {
    href: '/app/orders',
    icon: ShoppingCartIcon,
    title: 'Pedidos'
  },
  {
    href: '/app/customers',
    icon: ContactsIcon,
    title: 'Clientes'
  },
  {
    href: '/app/products',
    icon: LocalOfferIcon,
    title: 'Productos'
  },
  {
    href: '/app/account',
    icon: AssignmentIndIcon,
    title: 'Cuenta Personal'
  },
  {
    href: '/app/settings',
    icon: SettingsIcon,
    title: 'Configuración'
  }
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const storeData = useSelector((state) => state.storeData);
  const store = {
    key: 'defaultImage',
    avatar: storeData.urlImageLogo || storeData.defaultLogo,
    name: storeData.name || '',
    slogan: storeData.slogan || '',
  };

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        p={2}
      >
        <Avatar
          className={classes.avatar}
          component={RouterLink}
          src={store.avatar}
          to="/app/store"
        />
        <Typography
          className={classes.name}
          color="textPrimary"
          variant="h5"
        >
          {store.name}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          {store.slogan}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;
