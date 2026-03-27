import { useContext } from 'react';
import { PostContext } from '../context/PostContext';

// Custom hook for posts
const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};

export default usePosts;
