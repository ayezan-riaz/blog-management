import useAuth from '../hooks/useAuth';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import AuthorDashboard from '../components/dashboard/AuthorDashboard';
import Sidebar from '../components/layout/Sidebar';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="app-layout with-sidebar">
      <Sidebar />
      <div className="main-content">
        <div className="page-content">
          {user?.role === 'admin' ? <AdminDashboard /> : <AuthorDashboard />}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
