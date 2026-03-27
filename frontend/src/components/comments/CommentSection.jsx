import { useState, useEffect } from 'react';
import { HiChat, HiTrash } from 'react-icons/hi';
import API from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import Loader from '../common/Loader';
import './Comments.css';

const CommentSection = ({ postId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await API.get(`/posts/${postId}/comments`);
        if (res.data.success) {
          setComments(res.data.data.comments);
        }
      } catch (error) {
        console.error('Failed to fetch comments');
      } finally {
        setLoading(false);
      }
    };

    if (postId) fetchComments();
  }, [postId]);

  // Submit comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post(`/posts/${postId}/comments`, { content });
      if (res.data.success) {
        setComments([res.data.data.comment, ...comments]);
        setContent('');
        toast.success('Comment added!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete comment
  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      const res = await API.delete(`/comments/${commentId}`);
      if (res.data.success) {
        setComments(comments.filter((c) => c._id !== commentId));
        toast.success('Comment deleted');
      }
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <section className="comments-section" id="comments-section">
      <h3 className="comments-title">
        <HiChat /> Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="comment-form" id="comment-form">
          <div className="comment-form-header">
            <div className="author-avatar-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="comment-form-name">{user?.name}</span>
          </div>
          <textarea
            className="form-textarea comment-textarea"
            placeholder="Share your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            id="comment-input"
          />
          <div className="comment-form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              id="comment-submit"
            >
              {submitting ? <span className="btn-spinner" /> : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="comment-login-prompt">
          <p>Please <a href="/login">login</a> to leave a comment.</p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <Loader size="sm" />
        </div>
      ) : comments.length === 0 ? (
        <div className="comments-empty">
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="comments-list stagger-children">
          {comments.map((comment) => (
            <div key={comment._id} className="comment-item" id={`comment-${comment._id}`}>
              <div className="comment-header">
                <div className="comment-author">
                  <div className="author-avatar-sm">
                    {comment.author?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="comment-author-name">{comment.author?.name}</span>
                    <span className="comment-date">{formatDate(comment.createdAt)}</span>
                  </div>
                </div>
                {(user?._id === comment.author?._id || user?.role === 'admin') && (
                  <button
                    className="btn btn-ghost btn-icon comment-delete"
                    onClick={() => handleDelete(comment._id)}
                    title="Delete comment"
                  >
                    <HiTrash />
                  </button>
                )}
              </div>
              <p className="comment-content">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CommentSection;
