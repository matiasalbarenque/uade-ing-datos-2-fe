import { Menu } from 'antd';
import { NavLink } from 'react-router-dom';
import { Icon } from '@atoms/Icon';

export const Sidebar = () => {
  const screens = [
    {
      icon: 'hugeicons:dashboard-square-02',
      page: '',
      title: 'Dashboard',
    },
    {
      icon: 'ant-design:fund-projection-screen-outlined',
      page: '/projects',
      title: 'Proyectos',
    },
    {
      icon: 'hugeicons:task-done-01',
      page: '/tasks',
      title: 'Tareas',
    },
  ];

  const items = screens.map((a) => ({
    key: a.id,
    icon: <Icon icon={a.icon} className="!align-[-5px]" />,
    label: <NavLink to={`/admin${a.page}`}>{a.title}</NavLink>,
  }));

  return <Menu items={items} mode="vertical" style={{ width: '100%', borderInlineEnd: 'none' }} />;
};
