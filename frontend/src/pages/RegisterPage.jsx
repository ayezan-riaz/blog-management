import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import RegisterForm from '../components/auth/RegisterForm';
import './AuthPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="auth-page" id="register-page">
      <div className="auth-page-left">
        <div className="auth-page-branding">
          <div className="logo-icon-lg">B</div>
          <h2>BlogStack</h2>
          <p>Join thousands of writers and share your expertise with a global audience.</p>
          <div className="auth-features">
            <div className="auth-feature">🚀 Free to start</div>
            <div className="auth-feature">📝 Write & publish instantly</div>
            <div className="auth-feature">👤 Personal dashboard</div>
            <div className="auth-feature">🎨 Beautiful design</div>
          </div>
        </div>
      </div>
      <div className="auth-page-right">
        <RegisterForm onSuccess={() => navigate('/dashboard')} />
      </div>
    </div>
  );
};

export default RegisterPage;
