import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import usePosts from '../hooks/usePosts';
import PostForm from '../components/posts/PostForm';
import Sidebar from '../components/layout/Sidebar';
import Loader from '../components/common/Loader';

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { post, fetchPostById, updatePost, setPost } = usePosts();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      const result = await fetchPostById(id);
      if (!result) {
        navigate('/dashboard');
      }
      setPageLoading(false);
    };
    loadPost();

    // Cleanup
    return () => setPost(null);
  }, [id, fetchPostById, navigate, setPost]);

  const handleSubmit = async (postData) => {
    setLoading(true);
    const result = await updatePost(id, postData);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  if (pageLoading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="app-layout with-sidebar">
      <Sidebar />
      <div className="main-content">
        <div className="page-content">
          <div className="page-header">
            <h1>Edit Post</h1>
            <p>Update your blog post</p>
          </div>
          {post && <PostForm initialData={post} onSubmit={handleSubmit} loading={loading} />}
        </div>
      </div>
    </div>
  );
};

export default EditPostPage;
