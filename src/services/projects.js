import { ENV } from '@constants';
import { getAuthorization } from '@assets/scripts';

const entity = 'projects';

export const getProjects = async () => {
  const response = await fetch(`${ENV.API_URL}/${entity}`, {
    headers: {
      Authorization: getAuthorization(),
    },
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  throw new Error(data);
};

export const getProduct = async (id) => {
  const response = await fetch(`${ENV.API_URL}/${entity}/${id}`);
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  throw new Error(data);
};

export const postProject = async (body) => {
  const response = await fetch(`${ENV.API_URL}/${entity}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthorization(),
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  throw new Error(data);
};

export const putProject = async (body) => {
  const response = await fetch(`${ENV.API_URL}/${entity}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthorization(),
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  throw new Error(data);
};

export const deleteProject = async (id) => {
  const response = await fetch(`${ENV.API_URL}/${entity}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthorization(),
    },
  });
  if (!response.ok) {
    throw new Error('Error on delete');
  }
};
