import { NavLink, useLocation } from 'react-router-dom';
import {
  HiHome,
  HiDocumentText,
  HiPencilAlt,
  HiUsers,
  HiChartBar,
  HiCog,
} from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isAdmin = user?.role === 'admin';

  const menuItems = [
    {
      label: 'Dashboard',
      icon: <HiHome />,
      path: '/dashboard',
    },
    {
      label: 'Write Post',
      icon: <HiPencilAlt />,
      path: '/posts/create',
    },
  ];

  // Admin-only items
  if (isAdmin) {
    menuItems.push(
      {
        label: 'All Posts',
        icon: <HiChartBar />,
        path: '/dashboard?tab=all-posts',
      },
      {
        label: 'Users',
        icon: <HiUsers />,
        path: '/dashboard?tab=users',
      }
    );
  }

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-profile">
        <div className="sidebar-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="sidebar-user-info">
          <span className="sidebar-username">{user?.name}</span>
          <span className={`badge badge-${user?.role}`}>{user?.role}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Menu</div>
        {menuItems.map((item) => (
          <NavLink
            key={item.path + item.label}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive && !item.exact ? 'active' : ''}`
            }
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-tip">
          <span className="tip-icon">💡</span>
          <span className="tip-text">Pro Tip: Use Markdown shortcuts in the editor for faster writing!</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
