import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HiMenu, HiX, HiLogout, HiUser, HiPencilAlt, HiHome } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar" id="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" id="navbar-logo">
          <div className="logo-icon">B</div>
          <span className="logo-text">BlogStack</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            id="nav-home"
          >
            <HiHome />
            <span>Home</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                id="nav-dashboard"
              >
                <HiUser />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/posts/create"
                className={`nav-link ${isActive('/posts/create') ? 'active' : ''}`}
                id="nav-create-post"
              >
                <HiPencilAlt />
                <span>Write</span>
              </Link>

              <div className="navbar-user">
                <div className="user-avatar">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <span className="dropdown-name">{user?.name}</span>
                    <span className="dropdown-role">
                      <span className={`badge badge-${user?.role}`}>{user?.role}</span>
                    </span>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to="/dashboard" className="dropdown-item">
                    <HiUser /> Dashboard
                  </Link>
                  <button className="dropdown-item danger" onClick={handleLogout}>
                    <HiLogout /> Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="btn btn-ghost" id="nav-login">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" id="nav-register">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          id="mobile-menu-toggle"
        >
          {mobileMenuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu animate-fade-in" id="mobile-menu">
          <Link to="/" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </Link>
              <Link to="/posts/create" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                Write Post
              </Link>
              <button className="mobile-link danger" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
