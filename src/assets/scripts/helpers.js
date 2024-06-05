import Cookies from 'js-cookie';
import { format } from 'date-fns';
import { APP } from '@constants';

export const getAuthorization = (accessToken) => {
  const at = accessToken || Cookies.get(APP.ACCESS_TOKEN_NAME);
  if (!at) {
    // No existe token => cierra la sesión
    // localStorage.removeItem('user');
    // window.location.href = '/login';
    // return;
  }
  return `Bearer ${at}`;
};

export const formatDate = (date, dateFormat = 'dd/MM/yyyy') => {
  return format(new Date(date), dateFormat);
};

export const priceFormatting = (p, fractionDigits = 2) => {
  if (p === null || Number.isNaN(Number(p))) {
    throw new Error();
  }
  // Si el número tiene decimales lo forzamos que siempre represente 2 dígitos
  const options =
    Number(p) % 1 !== 0 ? { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits } : {};
  return Number(p).toLocaleString('de-DE', options);
};
