const APP_UTILS = {
  currencyFormat: (value) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
};

export default APP_UTILS;
