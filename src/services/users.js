import { ENV } from '@constants';
import { getAuthorization } from '@assets/scripts';

const entity = 'users';

export const getUserInfo = async (accessToken) => {
  const response = await fetch(`${ENV.API_URL}/${entity}/user-info`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthorization(accessToken),
    },
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  throw new Error(data);
};
