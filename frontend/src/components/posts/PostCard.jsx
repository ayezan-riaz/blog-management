import { Link } from 'react-router-dom';
import { HiClock, HiUser, HiChat, HiArrowRight } from 'react-icons/hi';
import './PostCard.css';

const PostCard = ({ post, showActions = false, onToggleStatus, onDelete }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const stripHtml = (html) => {
    return html?.replace(/<[^>]+>/g, '') || '';
  };

  return (
    <article className="post-card card animate-fade-in" id={`post-card-${post._id}`}>
      {post.featuredImage && (
        <div className="post-card-image">
          <img src={post.featuredImage} alt={post.title} />
        </div>
      )}

      <div className="card-body">
        <div className="post-card-meta">
          <span className={`badge badge-${post.status}`}>{post.status}</span>
          <span className="post-date">
            <HiClock /> {formatDate(post.createdAt)}
          </span>
        </div>

        <Link to={`/posts/${post.slug}`} className="post-card-title">
          <h3>{post.title}</h3>
        </Link>

        <p className="post-card-excerpt">
          {post.excerpt || stripHtml(post.content).substring(0, 150) + '...'}
        </p>

        {post.tags?.length > 0 && (
          <div className="post-card-tags">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag">
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="tag">+{post.tags.length - 3}</span>
            )}
          </div>
        )}

        <div className="post-card-footer">
          {post.author && (
            <div className="post-card-author">
              <div className="author-avatar-sm">
                {post.author.name?.charAt(0).toUpperCase()}
              </div>
              <span>{post.author.name}</span>
            </div>
          )}

          {showActions ? (
            <div className="post-card-actions">
              <button
                className={`btn btn-sm ${post.status === 'published' ? 'btn-secondary' : 'btn-success'}`}
                onClick={() => onToggleStatus(post._id)}
              >
                {post.status === 'published' ? 'Unpublish' : 'Publish'}
              </button>
              <Link to={`/posts/edit/${post._id}`} className="btn btn-sm btn-secondary">
                Edit
              </Link>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => onDelete(post._id)}
              >
                Delete
              </button>
            </div>
          ) : (
            <Link to={`/posts/${post.slug}`} className="post-card-read-more">
              Read More <HiArrowRight />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostCard;
