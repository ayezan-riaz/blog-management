import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';
import './AuthForms.css';

const LoginForm = ({ onSuccess }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await login(formData);
    setLoading(false);

    if (result.success && onSuccess) {
      onSuccess();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <div className="auth-form-wrapper animate-fade-in-up">
      <div className="auth-header">
        <h2>Welcome Back</h2>
        <p>Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form" id="login-form">
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div className="input-with-icon">
            <HiMail className="input-icon" />
            <input
              type="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              id="login-email"
            />
          </div>
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="input-with-icon">
            <HiLockClosed className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              id="login-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <HiEyeOff /> : <HiEye />}
            </button>
          </div>
          {errors.password && <span className="form-error">{errors.password}</span>}
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg auth-submit"
          disabled={loading}
          id="login-submit"
        >
          {loading ? <span className="btn-spinner" /> : 'Sign In'}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Don't have an account?{' '}
          <Link to="/register">Create one</Link>
        </p>
      </div>

      <div className="auth-demo-credentials">
        <p className="demo-title">Demo Credentials</p>
        <div className="demo-grid">
          <div className="demo-card" onClick={() => setFormData({ email: 'admin@blog.com', password: 'admin123' })}>
            <span className="badge badge-admin">Admin</span>
            <span>admin@blog.com</span>
          </div>
          <div className="demo-card" onClick={() => setFormData({ email: 'author@blog.com', password: 'author123' })}>
            <span className="badge badge-author">Author</span>
            <span>author@blog.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
