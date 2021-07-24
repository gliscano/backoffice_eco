import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  makeStyles,
  Button,
  SvgIcon
} from '@material-ui/core';
import { CLEAR_USER_DATA } from 'src/store/action_types';
import LoginServiceApi from 'src/services/LoginServiceApi';
import TableChartIcon from '@material-ui/icons/TableChart';
import StoreMallDirectoryRoundedIcon from '@material-ui/icons/StoreMallDirectoryRounded';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ContactsIcon from '@material-ui/icons/Contacts';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import SettingsIcon from '@material-ui/icons/Settings';
import InputIcon from '@material-ui/icons/Input';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import NavItem from './NavItem';

const items = [
  {
    href: '/app/dashboard',
    icon: TableChartIcon,
    title: 'Dashboard'
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
    href: '/app/category',
    icon: PlaylistAddIcon,
    title: 'Categoría'
  },
  {
    href: '/app/store',
    icon: StoreMallDirectoryRoundedIcon,
    title: 'Tienda'
  },
  {
    href: '/app/account',
    icon: AssignmentIndIcon,
    title: 'Mis Datos'
  },
  {
    href: '/app/settings',
    icon: SettingsIcon,
    title: 'Configuración'
  }
];

const useStyles = makeStyles((theme) => ({
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
  },
  boxItems: {
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const storeData = useSelector((state) => state.storeData);
  const dispatch = useDispatch();
  const loginServiceApi = new LoginServiceApi();
  const store = {
    key: 'defaultImage',
    avatar: storeData.urlImageLogo || storeData.defaultLogo,
    name: storeData.name || '',
    slogan: storeData.slogan || '',
  };

  const logout = () => {
    loginServiceApi.logout();
    dispatch({
      type: CLEAR_USER_DATA,
      payload: '',
    });
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
      <Box className={classes.boxItems}>
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
      <Divider />
      <Box className={classes.boxItems}>
        <Button
          fullWidth
          onClick={logout}
          startIcon={<SvgIcon component={InputIcon} />}
        >
          Cerrar Sesión
        </Button>
      </Box>
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
