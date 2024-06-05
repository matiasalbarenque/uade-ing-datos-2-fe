import { Icon as IconifyIcon } from '@iconify/react';

export const Icon = (props) => {
  const { icon, className, size = 22 } = props;
  return <IconifyIcon icon={icon} className={className} style={{ fontSize: size }} />;
};
