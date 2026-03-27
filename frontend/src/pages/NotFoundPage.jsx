import { Link } from 'react-router-dom';
import { HiHome } from 'react-icons/hi';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page" id="not-found-page">
      <div className="not-found-content animate-fade-in-up">
        <div className="not-found-code">404</div>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn btn-primary btn-lg">
          <HiHome /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
