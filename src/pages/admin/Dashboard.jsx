import { APP, ENV } from '@constants';
import { Alert } from 'antd';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { ofetch } from 'ofetch';
import { Link } from 'react-router-dom';
import useSWR from 'swr';

export const AdminDashboardPage = () => {
  const cookie = Cookies.get(APP.ACCESS_TOKEN_NAME);
  const { user_id } = jwtDecode(cookie);
  const { data, isLoading } = useSWR(`${ENV.API_URL}/profiles/${user_id}`, ofetch);

  if (isLoading) return <Alert message="Cargando..." type="info" showIcon />;

  if (!data)
    return (
      <Alert
        message="Cargar perfil"
        type="warning"
        showIcon
        description={
          <>
            <span>Para acceder a las distintas secciones en necesario que cargues tu perfil. </span>
            <Link to="/admin/profile">Ir a mi perfil</Link>
          </>
        }
      />
    );

  return (
    <main>
      <h1>Bienvenido {data.user_name}</h1>
    </main>
  );
};
