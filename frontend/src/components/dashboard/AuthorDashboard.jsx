import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { HiDocumentText, HiEye, HiPencil, HiPlus, HiTrash } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';
import usePosts from '../../hooks/usePosts';
import usePagination from '../../hooks/usePagination';
import PostCard from '../posts/PostCard';
import Pagination from '../common/Pagination';
import Loader from '../common/Loader';
import './Dashboard.css';

const AuthorDashboard = () => {
  const { user } = useAuth();
  const { myPosts, pagination, loading, fetchMyPosts, toggleStatus, deletePost } = usePosts();
  const { currentPage, goToPage, resetPage } = usePagination();
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchMyPosts(currentPage, statusFilter);
  }, [currentPage, statusFilter, fetchMyPosts]);

  const handleToggleStatus = async (postId) => {
    const result = await toggleStatus(postId);
    if (result.success) {
      fetchMyPosts(currentPage, statusFilter);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    const result = await deletePost(postId);
    if (result.success) {
      fetchMyPosts(currentPage, statusFilter);
    }
  };

  // Compute quick stats
  const totalPosts = myPosts.length;
  const publishedCount = myPosts.filter((p) => p.status === 'published').length;
  const draftCount = myPosts.filter((p) => p.status === 'draft').length;

  return (
    <div className="dashboard" id="author-dashboard">
      <div className="page-header">
        <div className="dashboard-header-row">
          <div>
            <h1>My Dashboard</h1>
            <p>Welcome, {user?.name}! Manage your blog posts.</p>
          </div>
          <Link to="/posts/create" className="btn btn-primary btn-lg">
            <HiPlus /> Write New Post
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid stats-grid-sm stagger-children">
        <div className="stat-card">
          <HiDocumentText className="stat-icon" />
          <div className="stat-value">{pagination?.totalPosts || 0}</div>
          <div className="stat-label">Total Posts</div>
        </div>
        <div className="stat-card">
          <HiEye className="stat-icon" />
          <div className="stat-value">{publishedCount}</div>
          <div className="stat-label">Published</div>
        </div>
        <div className="stat-card">
          <HiPencil className="stat-icon" />
          <div className="stat-value">{draftCount}</div>
          <div className="stat-label">Drafts</div>
        </div>
      </div>

      {/* Filter */}
      <div className="dashboard-toolbar">
        <h3>My Posts</h3>
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
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}><Loader /></div>
      ) : myPosts.length === 0 ? (
        <div className="posts-empty">
          <div className="posts-empty-icon">✍️</div>
          <h3>No posts yet</h3>
          <p>Start writing your first blog post!</p>
          <Link to="/posts/create" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            <HiPlus /> Create Post
          </Link>
        </div>
      ) : (
        <>
          <div className="posts-grid stagger-children">
            {myPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                showActions
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
          <Pagination pagination={pagination} onPageChange={goToPage} />
        </>
      )}
    </div>
  );
};

export default AuthorDashboard;
