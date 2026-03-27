import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import './PostForm.css';

const PostForm = ({ initialData = null, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft',
    tags: '',
    featuredImage: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        excerpt: initialData.excerpt || '',
        status: initialData.status || 'draft',
        tags: initialData.tags?.join(', ') || '',
        featuredImage: initialData.featuredImage || '',
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim() || formData.content === '<p><br></p>')
      newErrors.content = 'Content is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const postData = {
      ...formData,
      tags: formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    };

    onSubmit(postData);
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean'],
    ],
  };

  return (
    <form onSubmit={handleSubmit} className="post-form" id="post-form">
      <div className="post-form-main">
        <div className="form-group">
          <label className="form-label">Post Title</label>
          <input
            type="text"
            className={`form-input post-title-input ${errors.title ? 'error' : ''}`}
            placeholder="Enter an engaging title..."
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              if (errors.title) setErrors({ ...errors, title: '' });
            }}
            id="post-title"
          />
          {errors.title && <span className="form-error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Content</label>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={(value) => {
              setFormData({ ...formData, content: value });
              if (errors.content) setErrors({ ...errors, content: '' });
            }}
            modules={quillModules}
            placeholder="Write your blog post content..."
          />
          {errors.content && <span className="form-error">{errors.content}</span>}
        </div>
      </div>

      <div className="post-form-sidebar">
        <div className="form-card card">
          <div className="card-body">
            <h4 className="form-card-title">Post Settings</h4>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                id="post-status"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Excerpt</label>
              <textarea
                className="form-textarea"
                placeholder="Brief description of your post..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                id="post-excerpt"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tags (comma separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="react, javascript, webdev"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                id="post-tags"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Featured Image URL</label>
              <input
                type="text"
                className="form-input"
                placeholder="https://example.com/image.jpg"
                value={formData.featuredImage}
                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                id="post-featured-image"
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
                id="post-submit"
              >
                {loading ? (
                  <span className="btn-spinner" />
                ) : initialData ? (
                  'Update Post'
                ) : (
                  'Create Post'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PostForm;
