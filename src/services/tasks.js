import { ENV } from '@constants';
import { getAuthorization } from '@assets/scripts';

const entity = 'tasks';

export const getTasks = async () => {
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

export const getCandidatesTasks = async () => {
  const response = await fetch(`${ENV.API_URL}/${entity}/candidatesTasks`, {
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

export const getTask = async (id) => {
  const response = await fetch(`${ENV.API_URL}/${entity}/${id}`, {
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

export const postTask = async (body) => {
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

export const putTask = async (body) => {
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

export const deleteTask = async (id) => {
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
