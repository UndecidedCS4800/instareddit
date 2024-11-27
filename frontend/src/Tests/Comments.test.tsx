import { render, screen } from '@testing-library/react';
import { Comments } from '../components/Comments';
import { Comment as CommentType } from '../schema';
import '@testing-library/jest-dom';

jest.mock('../components/Comment', () => ({
  Comment: jest.fn(() => <div>Mocked Comment</div>), // Mocking Comment component for simplicity
}));

jest.mock('../components/CommentForm', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mocked Comment Form</div>), // Mocking CommentForm component
}));

describe('Comments Component', () => {
  const mockComments: CommentType[] = [
    {
      id: 1,
      user: 1,  // Changed user_id to user
      username: 'user1',
      post: 1,  // Changed post_id to post
      text: "This is the first comment.",
      datetime: "2024-11-13T12:00:00Z", // Changed created_at to datetime
    },
    {
      id: 2,
      user: 2,
      username: 'user2',
      post: 1,
      text: "This is the second comment.",
      datetime: "2024-11-13T12:05:00Z",
    },
  ];

  it('renders the Comment components for each comment in the list', () => {
    render(<Comments comments={mockComments} />);

    // Check if the Comment components are rendered for each item in the mockComments list
    expect(screen.getAllByText('Mocked Comment')).toHaveLength(mockComments.length);
  });

  it('renders the CommentForm component', () => {
    render(<Comments comments={mockComments} />);

    // Ensure the CommentForm is rendered
    expect(screen.getByText('Mocked Comment Form')).toBeInTheDocument();
  });

  it('updates the comments list when comments prop changes', () => {
    const { rerender } = render(<Comments comments={mockComments} />);

    // Initially check that the mocked comments are rendered
    expect(screen.getAllByText('Mocked Comment')).toHaveLength(mockComments.length);

    // New set of comments to update the props
    const updatedComments: CommentType[] = [
      {
        id: 3,
        user: 3,
        username: 'user3',
        post: 1,
        text: "This is the third comment.",
        datetime: "2024-11-13T12:10:00Z",
      },
    ];

    // Re-render the component with the updated comments
    rerender(<Comments comments={updatedComments} />);

    // Check if the updated comments are rendered
    expect(screen.getAllByText('Mocked Comment')).toHaveLength(updatedComments.length);
  });
});
