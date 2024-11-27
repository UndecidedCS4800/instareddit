import { render, screen, waitFor } from '@testing-library/react';
import Notifications from '../Notifications';
import { useAuth } from '../components/auth';
import { getFriendRequests } from '../remote';
import '@testing-library/jest-dom';

// Mocking the necessary modules
jest.mock('../components/auth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../remote', () => ({
  getFriendRequests: jest.fn(),
}));

jest.mock('../components/FriendRequestList', () => {
  return function MockFriendRequestList({ friend_requests }: { friend_requests: any }) {
    return <div data-testid="friend-request-list">{JSON.stringify(friend_requests)}</div>;
  };
});

describe('Notifications Component', () => {
  const mockAuth = { token: 'mockToken', username: 'mockUser' };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue(mockAuth);
    jest.clearAllMocks();
  });

  test('renders Notifications title', () => {
    render(<Notifications />);

    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  test('fetches and displays friend requests', async () => {
    const mockFriendRequests = [
      { id: 1, from: 'friend1' },
      { id: 2, from: 'friend2' },
    ];

    (getFriendRequests as jest.Mock).mockResolvedValue(mockFriendRequests);

    render(<Notifications />);

    await waitFor(() => {
      expect(getFriendRequests).toHaveBeenCalledWith(mockAuth.token, mockAuth.username);
      expect(screen.getByTestId('friend-request-list')).toHaveTextContent(JSON.stringify(mockFriendRequests));
    });
  });

  test('handles server error when fetching friend requests', async () => {
    const mockError = { error: 'Server error' };

    (getFriendRequests as jest.Mock).mockResolvedValue(mockError);

    console.error = jest.fn(); // Mock console.error to suppress error logs in test output

    render(<Notifications />);

    await waitFor(() => {
      expect(getFriendRequests).toHaveBeenCalledWith(mockAuth.token, mockAuth.username);
      expect(console.error).toHaveBeenCalledWith("server error", mockError);
    });
  });

  test('does not fetch friend requests if not authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue(null);

    render(<Notifications />);

    await waitFor(() => {
      expect(getFriendRequests).not.toHaveBeenCalled();
    });
  });
});
