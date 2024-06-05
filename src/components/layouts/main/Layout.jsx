import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Main from './Main';

export default function MainLayout() {
  return (
    <>
      <Header />
      <Main>
        <Outlet />
      </Main>
    </>
  );
}
