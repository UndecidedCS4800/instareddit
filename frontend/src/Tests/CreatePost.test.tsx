import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreatePost } from '../components/CreatePost';
import { useAuth } from '../components/auth';
import { createPost } from '../remote';
import { BrowserRouter as Router } from 'react-router-dom';

// Mocking dependencies
jest.mock('../components/auth');
jest.mock('../remote');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockUseAuth = useAuth as jest.Mock;
const mockCreatePost = createPost as jest.Mock;

describe('CreatePost Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should display login message if user is not authenticated', () => {
        // Mocking the auth hook to return null (not logged in)
        mockUseAuth.mockReturnValueOnce(null);

        render(
            <Router>
                <CreatePost />
            </Router>
        );

        expect(screen.getByText('Need to be logged in')).toBeInTheDocument();
    });

    test('should display error message if there is a server error', async () => {
        // Mock authenticated user
        mockUseAuth.mockReturnValueOnce({ token: 'mock-token' });

        // Mock createPost to return an error
        mockCreatePost.mockResolvedValueOnce({ error: 'Server Error' });

        render(
            <Router>
                <CreatePost />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText('Write your post...'), {
            target: { value: 'Test post content' },
        });

        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(screen.getByText('Error: Server Error')).toBeInTheDocument();
        });
    });

    test('should navigate to the created post page on success', async () => {
        // Mock authenticated user
        mockUseAuth.mockReturnValueOnce({ token: 'mock-token' });

        // Mock createPost to return a successful response with a post ID
        mockCreatePost.mockResolvedValueOnce({ id: 1 });

        render(
            <Router>
                <CreatePost />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText('Write your post...'), {
            target: { value: 'Test post content' },
        });

        fireEvent.click(screen.getByText('Submit'));

        // Wait for the navigation to happen
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('../posts/1', { replace: true });
        });
    });

    test('should render the modal and submit a post', async () => {
        // Mock authenticated user
        mockUseAuth.mockReturnValueOnce({ token: 'mock-token' });

        render(
            <Router>
                <CreatePost />
            </Router>
        );

        // Check that modal and form are rendered
        expect(screen.getByPlaceholderText('Write your post...')).toBeInTheDocument();
        expect(screen.getByText('Submit')).toBeInTheDocument();

        // Simulate typing into the input field
        fireEvent.change(screen.getByPlaceholderText('Write your post...'), {
            target: { value: 'Test post content' },
        });

        // Simulate form submission
        fireEvent.click(screen.getByText('Submit'));

        // Check that the form is being submitted and the correct methods are called
        await waitFor(() => {
            expect(mockCreatePost).toHaveBeenCalledWith('mock-token', {
                text: 'Test post content',
                community: NaN, // Adjust based on your params setup
            });
        });
    });
});
