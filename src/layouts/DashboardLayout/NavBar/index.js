// React
import React, { useEffect } from 'react';
// Redux and Router
import { useSelector, useDispatch } from 'react-redux';
import { CLEAR_USER_DATA } from 'src/store/action_types';
import {
  Link as RouterLink,
  useLocation
} from 'react-router-dom';
import PropTypes from 'prop-types';
// Material IU and Icons
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
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import BlurOnIcon from '@material-ui/icons/BlurOn';
import ContactsIcon from '@material-ui/icons/Contacts';
import InputIcon from '@material-ui/icons/Input';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import SettingsIcon from '@material-ui/icons/Settings';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import StoreMallDirectoryRoundedIcon from '@material-ui/icons/StoreMallDirectoryRounded';
import TableChartIcon from '@material-ui/icons/TableChart';
// Service Api
import LoginServiceApi from 'src/services/LoginServiceApi';
// Constants of Configuration
import APP_CONFIG from 'src/config/app.config';
// Components
import NavItem from './NavItem';

const useStyles = makeStyles((theme) => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)',
    boxShadow: '0px 1px 8px -3px rgba(69,90,100,0.8)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  },
  boxItems: {
    paddingTop: theme.spacing(0),
    paddingLeft: theme.spacing(2),
  }
}));

const items = [
  {
    href: `${APP_CONFIG.ROUTE_DASHBOARD}`,
    icon: TableChartIcon,
    title: 'Inicio',
    show: true,
  },
  {
    href: `${APP_CONFIG.ROUTE_STORE}`,
    icon: StoreMallDirectoryRoundedIcon,
    title: 'Tienda',
    show: true,
  },
  {
    href: `${APP_CONFIG.ROUTE_PRODUCTS}`,
    icon: LocalOfferIcon,
    title: 'Productos',
    show: false,
  },
  {
    href: `${APP_CONFIG.ROUTE_CATEGORY}`,
    icon: PlaylistAddIcon,
    title: 'Categoría',
    show: false,
  },
  {
    href: `${APP_CONFIG.ROUTE_ORDERS}`,
    icon: ShoppingCartIcon,
    title: 'Pedidos',
    show: false,
  },
  {
    href: `${APP_CONFIG.ROUTE_CUSTOMERS}`,
    icon: ContactsIcon,
    title: 'Clientes',
    show: false,
  },
  {
    href: `${APP_CONFIG.ROUTE_GENERATE_QR}`,
    icon: BlurOnIcon,
    title: 'Generar Código QR',
    show: false,
  },
  {
    href: `${APP_CONFIG.ROUTE_ADDRESS}`,
    icon: AssignmentIndIcon,
    title: 'Mis Direcciones',
    show: true,
  },
  {
    href: `${APP_CONFIG.ROUTE_SETTINGS}`,
    icon: SettingsIcon,
    title: 'Configuración',
    show: true,
  }
];

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
    created: !!storeData.store_id,
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
        p={1}
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
              disable={(item.show) ? false : !store.created}
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
