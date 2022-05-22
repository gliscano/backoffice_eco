import { useDispatch, useSelector } from 'react-redux';
import { HIDE_ALERT, SET_ALERT_DATA } from 'src/store/action_types';

const useAlertBar = () => {
  const appData = useSelector((state) => state.app);
  const dispatch = useDispatch();

  /* Hide aler bar and clear data store */
  const hideAlert = () => {
    dispatch({
      type: HIDE_ALERT,
      payload: ''
    });
  };

  /**
   * Show Alert bar and set the alert data in the store
   * @param typeAlert - success, error or 'info'
   * @param message - The message to be displayed in the alert
   */
  const showAlert = ({ typeAlert, message }) => {
    const { alert, ...rest } = appData;
    const alertData = {
      ...alert,
      open: true,
      message,
      severity: typeAlert,
      callback: hideAlert,
    };

    const data = {
      ...rest,
      alert: alertData
    };

    dispatch({
      type: SET_ALERT_DATA,
      payload: data
    });
  };

  return {
    hideAlert,
    showAlert
  };
};

export default useAlertBar;
