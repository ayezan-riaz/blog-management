import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePosts from '../hooks/usePosts';
import PostForm from '../components/posts/PostForm';
import Sidebar from '../components/layout/Sidebar';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { createPost } = usePosts();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (postData) => {
    setLoading(true);
    const result = await createPost(postData);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="app-layout with-sidebar">
      <Sidebar />
      <div className="main-content">
        <div className="page-content">
          <div className="page-header">
            <h1>Create New Post</h1>
            <p>Write and publish your blog post</p>
          </div>
          <PostForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
