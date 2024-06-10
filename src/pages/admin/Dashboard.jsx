import { Alert } from 'antd';
import { Link } from 'react-router-dom';

export const AdminDashboardPage = () => {
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
};
