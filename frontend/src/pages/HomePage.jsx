import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { HiPencilAlt, HiArrowRight, HiSearch, HiBookOpen } from 'react-icons/hi';
import usePosts from '../hooks/usePosts';
import useAuth from '../hooks/useAuth';
import usePagination from '../hooks/usePagination';
import PostCard from '../components/posts/PostCard';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import Loader from '../components/common/Loader';
import './HomePage.css';

const HomePage = () => {
  const { posts, pagination, loading, fetchPosts } = usePosts();
  const { isAuthenticated } = useAuth();
  const { currentPage, goToPage, resetPage } = usePagination();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPosts(currentPage, search);
  }, [currentPage, search, fetchPosts]);

  const handleSearch = useCallback((query) => {
    setSearch(query);
    resetPage();
  }, [resetPage]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero-bg">
          <div className="hero-orb orb-1" />
          <div className="hero-orb orb-2" />
          <div className="hero-orb orb-3" />
        </div>
        <div className="hero-content container animate-fade-in-up">
          <div className="hero-badge">
            <HiBookOpen /> Modern Blog Platform
          </div>
          <h1>
            Share Your Stories,<br />
            <span className="hero-gradient-text">Inspire the World</span>
          </h1>
          <p className="hero-subtitle">
            A modern platform for writers, developers, and creators to share ideas,
            knowledge, and experiences with the world.
          </p>
          <div className="hero-actions">
            {isAuthenticated ? (
              <Link to="/posts/create" className="btn btn-primary btn-lg" id="hero-cta">
                <HiPencilAlt /> Start Writing
              </Link>
            ) : (
              <Link to="/register" className="btn btn-primary btn-lg" id="hero-cta">
                Get Started Free <HiArrowRight />
              </Link>
            )}
            <a href="#posts-section" className="btn btn-secondary btn-lg">
              Explore Posts
            </a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">{pagination?.totalPosts || 0}</span>
              <span className="hero-stat-label">Published Posts</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">100%</span>
              <span className="hero-stat-label">MERN Stack</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">Free</span>
              <span className="hero-stat-label">Open Platform</span>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="posts-section container" id="posts-section">
        <div className="section-header">
          <div>
            <h2 className="section-heading">Latest Posts</h2>
            <p className="section-subheading">Discover stories, thinking, and expertise from writers.</p>
          </div>
          <SearchBar onSearch={handleSearch} placeholder="Search posts..." />
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <Loader size="lg" />
          </div>
        ) : posts.length === 0 ? (
          <div className="posts-empty animate-fade-in">
            <div className="posts-empty-icon">📝</div>
            <h3>{search ? 'No posts found' : 'No posts yet'}</h3>
            <p>{search ? 'Try a different search term.' : 'Be the first to publish a post!'}</p>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="posts-grid stagger-children">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Pagination pagination={pagination} onPageChange={goToPage} />
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
