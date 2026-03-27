import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  HiDocumentText,
  HiUsers,
  HiChat,
  HiEye,
  HiPencil,
  HiPlus,
  HiTrash,
  HiRefresh,
} from 'react-icons/hi';
import API from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import usePosts from '../../hooks/usePosts';
import usePagination from '../../hooks/usePagination';
import PostCard from '../posts/PostCard';
import SearchBar from '../common/SearchBar';
import Pagination from '../common/Pagination';
import Loader from '../common/Loader';
import toast from 'react-hot-toast';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { posts, pagination, loading, fetchAllPostsAdmin, toggleStatus, deletePost } = usePosts();
  const { currentPage, goToPage, resetPage } = usePagination();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersPagination, setUsersPagination] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/users/stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats');
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Fetch posts when tab changes
  useEffect(() => {
    if (activeTab === 'posts') {
      fetchAllPostsAdmin(currentPage, statusFilter, search);
    }
  }, [activeTab, currentPage, statusFilter, search, fetchAllPostsAdmin]);

  // Fetch users
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async (page = 1) => {
    try {
      const res = await API.get(`/users?page=${page}&limit=10`);
      if (res.data.success) {
        setUsers(res.data.data.users);
        setUsersPagination(res.data.data.pagination);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const handleSearch = useCallback((query) => {
    setSearch(query);
    resetPage();
  }, [resetPage]);

  const handleToggleStatus = async (postId) => {
    await toggleStatus(postId);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    await deletePost(postId);
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      const res = await API.put(`/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
        toast.success('User role updated!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('This will delete the user and all their posts. Continue?')) return;
    try {
      const res = await API.delete(`/users/${userId}`);
      if (res.data.success) {
        setUsers(users.filter((u) => u._id !== userId));
        toast.success('User deleted');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="dashboard" id="admin-dashboard">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.name}! Manage your blog platform.</p>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          All Posts
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="dashboard-content animate-fade-in">
          {statsLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}><Loader /></div>
          ) : stats && (
            <>
              <div className="stats-grid stagger-children">
                <div className="stat-card">
                  <HiDocumentText className="stat-icon" />
                  <div className="stat-value">{stats.stats.totalPosts}</div>
                  <div className="stat-label">Total Posts</div>
                </div>
                <div className="stat-card">
                  <HiEye className="stat-icon" />
                  <div className="stat-value">{stats.stats.publishedPosts}</div>
                  <div className="stat-label">Published</div>
                </div>
                <div className="stat-card">
                  <HiPencil className="stat-icon" />
                  <div className="stat-value">{stats.stats.draftPosts}</div>
                  <div className="stat-label">Drafts</div>
                </div>
                <div className="stat-card">
                  <HiUsers className="stat-icon" />
                  <div className="stat-value">{stats.stats.totalUsers}</div>
                  <div className="stat-label">Users</div>
                </div>
                <div className="stat-card">
                  <HiChat className="stat-icon" />
                  <div className="stat-value">{stats.stats.totalComments}</div>
                  <div className="stat-label">Comments</div>
                </div>
              </div>

              <div className="dashboard-sections">
                <div className="dashboard-section">
                  <h3 className="section-title">Recent Posts</h3>
                  <div className="recent-list">
                    {stats.recentPosts?.map((post) => (
                      <div key={post._id} className="recent-item">
                        <div className="recent-item-info">
                          <Link to={`/posts/${post.slug}`} className="recent-item-title">
                            {post.title}
                          </Link>
                          <span className="recent-item-meta">
                            by {post.author?.name} • <span className={`badge badge-${post.status}`}>{post.status}</span>
                          </span>
                        </div>
                        <span className="recent-item-date">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dashboard-section">
                  <h3 className="section-title">Recent Users</h3>
                  <div className="recent-list">
                    {stats.recentUsers?.map((u) => (
                      <div key={u._id} className="recent-item">
                        <div className="recent-item-info">
                          <span className="recent-item-title">{u.name}</span>
                          <span className="recent-item-meta">
                            {u.email} • <span className={`badge badge-${u.role}`}>{u.role}</span>
                          </span>
                        </div>
                        <span className="recent-item-date">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <div className="dashboard-content animate-fade-in">
          <div className="dashboard-toolbar">
            <SearchBar onSearch={handleSearch} placeholder="Search all posts..." />
            <div className="toolbar-actions">
              <select
                className="form-select toolbar-select"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); resetPage(); }}
              >
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <Link to="/posts/create" className="btn btn-primary">
                <HiPlus /> New Post
              </Link>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}><Loader /></div>
          ) : posts.length === 0 ? (
            <div className="posts-empty">
              <div className="posts-empty-icon">📝</div>
              <h3>No posts found</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <>
              <div className="posts-table-wrapper">
                <table className="posts-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post._id}>
                        <td>
                          <Link to={`/posts/${post.slug}`} className="table-post-title">
                            {post.title}
                          </Link>
                        </td>
                        <td>
                          <span className="table-author">{post.author?.name}</span>
                        </td>
                        <td>
                          <span className={`badge badge-${post.status}`}>{post.status}</span>
                        </td>
                        <td className="table-date">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              className={`btn btn-sm ${post.status === 'published' ? 'btn-secondary' : 'btn-success'}`}
                              onClick={() => handleToggleStatus(post._id)}
                            >
                              {post.status === 'published' ? 'Unpublish' : 'Publish'}
                            </button>
                            <Link to={`/posts/edit/${post._id}`} className="btn btn-sm btn-secondary">
                              Edit
                            </Link>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeletePost(post._id)}
                            >
                              <HiTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination pagination={pagination} onPageChange={goToPage} />
            </>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="dashboard-content animate-fade-in">
          <div className="posts-table-wrapper">
            <table className="posts-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="table-user">
                        <div className="author-avatar-sm">{u.name?.charAt(0).toUpperCase()}</div>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge badge-${u.role}`}>{u.role}</span>
                    </td>
                    <td className="table-date">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {u._id !== user?._id && (
                        <div className="table-actions">
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleChangeRole(u._id, u.role === 'admin' ? 'author' : 'admin')}
                          >
                            Make {u.role === 'admin' ? 'Author' : 'Admin'}
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteUser(u._id)}
                          >
                            <HiTrash />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {usersPagination && (
            <Pagination pagination={usersPagination} onPageChange={(page) => fetchUsers(page)} />
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
