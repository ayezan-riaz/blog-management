import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiUser, HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';
import './AuthForms.css';

const RegisterForm = ({ onSuccess }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
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
        <h2>Create Account</h2>
        <p>Join BlogStack and start writing</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form" id="register-form">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <div className="input-with-icon">
            <HiUser className="input-icon" />
            <input
              type="text"
              name="name"
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              id="register-name"
            />
          </div>
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

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
              id="register-email"
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
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              id="register-password"
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

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <div className="input-with-icon">
            <HiLockClosed className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              id="register-confirm-password"
            />
          </div>
          {errors.confirmPassword && (
            <span className="form-error">{errors.confirmPassword}</span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg auth-submit"
          disabled={loading}
          id="register-submit"
        >
          {loading ? <span className="btn-spinner" /> : 'Create Account'}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
