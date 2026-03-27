import { createContext, useState, useCallback } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

export const PostContext = createContext(null);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get published posts (public)
  const fetchPosts = useCallback(async (page = 1, search = '', tag = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (search) params.append('search', search);
      if (tag) params.append('tag', tag);

      const res = await API.get(`/posts?${params.toString()}`);
      if (res.data.success) {
        setPosts(res.data.data.posts);
        setPagination(res.data.data.pagination);
      }
    } catch (error) {
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single post by slug
  const fetchPostBySlug = useCallback(async (slug) => {
    setLoading(true);
    try {
      const res = await API.get(`/posts/slug/${slug}`);
      if (res.data.success) {
        setPost(res.data.data.post);
        return res.data.data.post;
      }
    } catch (error) {
      toast.error('Post not found');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single post by ID (for editing)
  const fetchPostById = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await API.get(`/posts/${id}`);
      if (res.data.success) {
        setPost(res.data.data.post);
        return res.data.data.post;
      }
    } catch (error) {
      toast.error('Post not found');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get my posts
  const fetchMyPosts = useCallback(async (page = 1, status = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (status) params.append('status', status);

      const res = await API.get(`/posts/my-posts?${params.toString()}`);
      if (res.data.success) {
        setMyPosts(res.data.data.posts);
        setPagination(res.data.data.pagination);
      }
    } catch (error) {
      toast.error('Failed to fetch your posts');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all posts (admin)
  const fetchAllPostsAdmin = useCallback(async (page = 1, status = '', search = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (status) params.append('status', status);
      if (search) params.append('search', search);

      const res = await API.get(`/posts/admin/all?${params.toString()}`);
      if (res.data.success) {
        setPosts(res.data.data.posts);
        setPagination(res.data.data.pagination);
      }
    } catch (error) {
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create post
  const createPost = async (postData) => {
    try {
      const res = await API.post('/posts', postData);
      if (res.data.success) {
        toast.success('Post created successfully!');
        return { success: true, post: res.data.data.post };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create post';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Update post
  const updatePost = async (id, postData) => {
    try {
      const res = await API.put(`/posts/${id}`, postData);
      if (res.data.success) {
        toast.success('Post updated successfully!');
        return { success: true, post: res.data.data.post };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update post';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Delete post
  const deletePost = async (id) => {
    try {
      const res = await API.delete(`/posts/${id}`);
      if (res.data.success) {
        toast.success('Post deleted successfully!');
        // Remove from local state
        setPosts((prev) => prev.filter((p) => p._id !== id));
        setMyPosts((prev) => prev.filter((p) => p._id !== id));
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete post';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Toggle post status
  const toggleStatus = async (id) => {
    try {
      const res = await API.patch(`/posts/${id}/status`);
      if (res.data.success) {
        const updatedPost = res.data.data.post;
        toast.success(`Post ${updatedPost.status === 'published' ? 'published' : 'moved to drafts'}!`);
        // Update local state
        setPosts((prev) =>
          prev.map((p) => (p._id === id ? updatedPost : p))
        );
        setMyPosts((prev) =>
          prev.map((p) => (p._id === id ? updatedPost : p))
        );
        return { success: true, post: updatedPost };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to toggle status';
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    posts,
    post,
    myPosts,
    pagination,
    loading,
    fetchPosts,
    fetchPostBySlug,
    fetchPostById,
    fetchMyPosts,
    fetchAllPostsAdmin,
    createPost,
    updatePost,
    deletePost,
    toggleStatus,
    setPost,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};
