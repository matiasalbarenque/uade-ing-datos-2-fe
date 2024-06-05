import { Menu } from 'antd';
import { NavLink } from 'react-router-dom';

export const Sidebar = () => {
  const getItem = (label, key, icon, children, type) => {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  };

  const getItems = () => {
    const screens = [
      {
        description: 'Proyectos',
        screen: 'projects',
      },
      {
        description: 'Tareas',
        screen: 'tasks',
      }
    ];

    return [
      getItem(
        'Secciones',
        'grp',
        null,
        screens.map((a) => getItem(<NavLink to={`/admin/${a.screen}`}>{a.description}</NavLink>, a.id)),
        'group',
      ),
    ];
  };

  return <Menu style={{ width: '100%', borderInlineEnd: 'none' }} mode="inline" items={getItems()} />;
}
