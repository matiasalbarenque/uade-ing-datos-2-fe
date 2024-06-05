import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/use-auth';
import Header from '../Header';
import Main from './Main';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // if (!user.isLogged) {
    //   navigate('/login');
    //   return;
    // }
  }, []);

  return (
    <>
      <Header />
      <Main>
        <Outlet />
      </Main>
    </>
  );
}
