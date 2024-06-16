import { Link, useNavigate } from 'react-router-dom';
import { Button, Divider, Dropdown } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '@hooks/use-auth';

export const UserAvatar = () => {
  const navigate = useNavigate();
  const { user, resetUser } = useAuth();

  const loginHandler = () => {
    navigate('/login');
  };

  const logout = () => {
    resetUser();
    navigate('/login');
  };

  if (user.isLogged) {
    return (
      <div>
        <Dropdown
          placement="bottomRight"
          arrow={{ pointAtCenter: true }}
          trigger={['click']}
          dropdownRender={() => (
            <div className="min-w-[220px] p-2 flex flex-col gap-2 bg-white rounded-md shadow-lg">
              <div className="px-3 py-2 w-full flex flex-col bg-gray-50 border border-gray-200 rounded-md">
                <span className="font-medium">{`${user.firstName} ${user.lastName} (${user.nickname})`}</span>
                <span className="text-gray-400">{`${user.email}`}</span>
              </div>
              <div className="flex flex-col gap-2">
                <Link to="/admin/profile" className="px-3 py-1 text-center !text-gray-600 hover:bg-gray-100 rounded-sm">
                  Mi perfil
                </Link>
                <Divider className="!m-0" />
              </div>
              <Button type="text" onClick={logout}>
                Cerrar sesión
              </Button>
            </div>
          )}
        >
          <div className="w-[40px] border border-gray-300 rounded-full overflow-hidden cursor-pointer hover:border-amber-400 transition-colors duration-300">
            <img
              src={user?.avatarUrl || '/avatars/no-avatar.jpg'}
              alt={user.firstName}
              width="40"
              height="40"
              className="w-full h-full object-cover"
            />
          </div>
        </Dropdown>
      </div>
    );
  }

  return <Button type="default" shape="circle" icon={<UserOutlined />} size="large" onClick={loginHandler} />;
};
