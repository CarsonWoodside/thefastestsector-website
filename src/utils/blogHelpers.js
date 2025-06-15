import { blogPosts as initialPosts } from '../data/blogPosts';

export const getStoredPosts = () => {
  const stored = localStorage.getItem('blogPosts');
  return stored ? JSON.parse(stored) : initialPosts;
};

export const saveStoredPosts = (posts) => {
  localStorage.setItem('blogPosts', JSON.stringify(posts));
};
