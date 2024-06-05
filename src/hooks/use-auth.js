import { useContext } from 'react';
import { AuthContext } from '@providers/auth';

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  return authContext;
};
