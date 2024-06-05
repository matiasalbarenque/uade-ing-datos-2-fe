import { ENV } from '@constants';

const entity = 'auth';

export const login = async (body) => {
  const response = await fetch(`${ENV.API_URL}/${entity}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  throw new Error(data);
};

export const signup = async (body) => {
  const response = await fetch(`${ENV.API_URL}/${entity}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  throw new Error(data);
};
