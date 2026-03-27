import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoginForm from '../components/auth/LoginForm';
import './AuthPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="auth-page" id="login-page">
      <div className="auth-page-left">
        <div className="auth-page-branding">
          <div className="logo-icon-lg">B</div>
          <h2>BlogStack</h2>
          <p>Your modern blog management platform for sharing ideas and stories with the world.</p>
          <div className="auth-features">
            <div className="auth-feature">✅ Rich text editor</div>
            <div className="auth-feature">✅ Role-based access</div>
            <div className="auth-feature">✅ Search & pagination</div>
            <div className="auth-feature">✅ Real-time comments</div>
          </div>
        </div>
      </div>
      <div className="auth-page-right">
        <LoginForm onSuccess={() => navigate('/dashboard')} />
      </div>
    </div>
  );
};

export default LoginPage;
