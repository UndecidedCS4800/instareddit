import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from '../NavBar';
import { useAuth, useAuthDispatch } from '../components/auth';
import '@testing-library/jest-dom';

jest.mock('../components/auth');

const mockUseAuth = useAuth as jest.Mock;
const mockUseAuthDispatch = useAuthDispatch as jest.Mock;

describe('NavBar Component', () => {
    beforeEach(() => {
        jest.clearAllMocks(); 
    });

    test('renders login link when user is not authenticated', () => {
        mockUseAuth.mockReturnValue(null); 
        render(
            <Router>
                <NavBar />
            </Router>
        );

        expect(screen.getByText(/login/i)).toBeInTheDocument(); 
        expect(screen.queryByText(/hello/i)).not.toBeInTheDocument(); 
    });

    test('renders greeting and logout when user is authenticated', () => {
        const mockUser = { username: 'JohnDoe' }; 
        mockUseAuth.mockReturnValue(mockUser);
        const mockDispatch = jest.fn();
        mockUseAuthDispatch.mockReturnValue(mockDispatch);

        render(
            <Router>
                <NavBar />
            </Router>
        );

        expect(screen.getByText(/Logout of johndoe/i)).toBeInTheDocument();
        expect(screen.queryByText(/login/i)).not.toBeInTheDocument();

        
        fireEvent.click(screen.getByText(/Logout of johndoe/i));
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'logout' });
    });

    test('renders navigation links correctly', () => {
        mockUseAuth.mockReturnValue(null);

        render(
            <Router>
                <NavBar />
            </Router>
        );

        expect(screen.getByText(/home/i)).toBeInTheDocument();
        expect(screen.getByText(/about us/i)).toBeInTheDocument();
        expect(screen.getByText(/messages/i)).toBeInTheDocument();
        expect(screen.getByText(/notifications/i)).toBeInTheDocument();
    });
});