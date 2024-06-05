import { Link } from 'react-router-dom';
import { UserAvatar } from './HeaderAvatar';

export default function Header(props) {
  const { children } = props;
  return (
    <header className="p-3 bg-white border-b flex justify-between gap-5 sticky top-0 z-10">
      <div className="flex items-center">
        <Link to="/">
          <img src="/icon.svg" alt="Logo" width="38" height="38" />
        </Link>
      </div>

      {children}

      <div className="flex gap-4">
        <UserAvatar />
      </div>
    </header>
  );
}
