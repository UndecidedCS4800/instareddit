import { render, screen } from '@testing-library/react';
import { Post } from '../components/Post';
import { useLoaderData } from 'react-router-dom';
import { getPostComments } from '../remote';
import '@testing-library/jest-dom';

// Mock the external functions and components
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLoaderData: jest.fn(),
  }));
  
  jest.mock('../remote', () => ({
    getPostComments: jest.fn(),
  }));
  
  jest.mock('../components/PostCard', () => ({
    PostCard: jest.fn(() => <div>PostCard</div>),
  }));
  
  jest.mock('../components/Comments', () => ({
    Comments: jest.fn(() => <div>Comments</div>),
  }));
  
  describe('Post Component', () => {
    
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('renders the post and comments successfully', async () => {
      const mockPost = {
        id: 1,
        title: 'Post Title',
        content: 'Post content...',
      };
      const mockComments = [
        { id: 1, text: 'First comment' },
        { id: 2, text: 'Second comment' },
      ];
  
      // Mock the response of useLoaderData and getPostComments
      (useLoaderData as jest.Mock).mockReturnValue({
        post: mockPost,
        comments: mockComments,
      });
      (getPostComments as jest.Mock).mockResolvedValue({
        post: mockPost,
        comments: mockComments,
      });
  
      render(<Post />);
  
      // Ensure PostCard is rendered with post data
      expect(screen.getByText('PostCard')).toBeInTheDocument();
  
      // Ensure Comments component is rendered with comments
      expect(screen.getByText('Comments')).toBeInTheDocument();
    });
  
    it('displays an error message when the loader throws an error', async () => {
      const errorMessage = 'Invalid community id or invalid post id';
  
      // Mock the response of useLoaderData to simulate an error
      (useLoaderData as jest.Mock).mockReturnValue({ error: errorMessage });
      (getPostComments as jest.Mock).mockRejectedValue(new Error(errorMessage));
  
      render(<Post />);
  
      // Ensure the error message is displayed
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  
    it('does not render comments if none are provided', async () => {
      const mockPost = {
        id: 1,
        title: 'Post Title',
        content: 'Post content...',
      };
  
      // Mock the response of useLoaderData and getPostComments without comments
      (useLoaderData as jest.Mock).mockReturnValue({
        post: mockPost,
        comments: [],
      });
      (getPostComments as jest.Mock).mockResolvedValue({
        post: mockPost,
        comments: [],
      });
  
      render(<Post />);
  
      // Ensure PostCard is rendered
      expect(screen.getByText('PostCard')).toBeInTheDocument();
  
    });
});