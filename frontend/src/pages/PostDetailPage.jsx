import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { HiClock, HiUser, HiArrowLeft, HiPencil, HiTag } from 'react-icons/hi';
import usePosts from '../hooks/usePosts';
import useAuth from '../hooks/useAuth';
import CommentSection from '../components/comments/CommentSection';
import Loader from '../components/common/Loader';
import './PostDetailPage.css';

const PostDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { post, fetchPostBySlug, setPost } = usePosts();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      const result = await fetchPostBySlug(slug);
      if (!result) {
        navigate('/');
      }
      setLoading(false);
    };
    loadPost();

    return () => setPost(null);
  }, [slug, fetchPostBySlug, navigate, setPost]);

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!post) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isOwner = user && post.author && user._id === post.author._id;
  const isAdmin = user?.role === 'admin';

  return (
    <div className="post-detail-page">
      <div className="container">
        <div className="post-detail-wrapper animate-fade-in">
          {/* Back button */}
          <Link to="/" className="back-link" id="back-to-posts">
            <HiArrowLeft /> Back to Posts
          </Link>

          {/* Post Header */}
          <header className="post-detail-header">
            <div className="post-detail-meta">
              <span className={`badge badge-${post.status}`}>{post.status}</span>
              <span className="post-detail-date">
                <HiClock /> {formatDate(post.createdAt)}
              </span>
              {post.updatedAt !== post.createdAt && (
                <span className="post-detail-date">
                  (Updated: {formatDate(post.updatedAt)})
                </span>
              )}
            </div>

            <h1 className="post-detail-title">{post.title}</h1>

            {post.excerpt && (
              <p className="post-detail-excerpt">{post.excerpt}</p>
            )}

            <div className="post-detail-author-bar">
              <div className="post-detail-author">
                <div className="author-avatar-md">
                  {post.author?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="author-name">{post.author?.name}</span>
                  {post.author?.bio && <span className="author-bio">{post.author.bio}</span>}
                </div>
              </div>

              {(isOwner || isAdmin) && (
                <Link to={`/posts/edit/${post._id}`} className="btn btn-secondary btn-sm">
                  <HiPencil /> Edit Post
                </Link>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="post-detail-image">
              <img src={post.featuredImage} alt={post.title} />
            </div>
          )}

          {/* Post Content */}
          <div
            className="post-detail-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
            id="post-content"
          />

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="post-detail-tags">
              <HiTag />
              {post.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}

          {/* Comments */}
          <CommentSection postId={post._id} />
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
