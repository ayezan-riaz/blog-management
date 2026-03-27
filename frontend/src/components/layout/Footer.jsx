import { Link } from 'react-router-dom';
import { HiHeart } from 'react-icons/hi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="logo-icon">B</div>
              <span>BlogStack</span>
            </Link>
            <p className="footer-tagline">
              A modern blog platform for sharing ideas and stories.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h4>Platform</h4>
              <Link to="/">Home</Link>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <a href="#" onClick={e => e.preventDefault()}>Documentation</a>
              <a href="#" onClick={e => e.preventDefault()}>API Reference</a>
              <a href="#" onClick={e => e.preventDefault()}>Support</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} BlogStack. Made with{' '}
            <HiHeart className="heart-icon" /> using MERN Stack
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
