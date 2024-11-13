import { render, screen } from '@testing-library/react';
import App from '../App';
import { useAuth } from '../components/auth';

// Mock the necessary imports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: jest.fn(() => <div>Outlet Component</div>),
}));

// Mock `useAuth`
jest.mock('../components/auth', () => ({
  useAuth: jest.fn() as jest.Mock,
}));

// Mock NavBar
jest.mock('../NavBar', () => jest.fn(() => <div>NavBar</div>));

describe('App component', () => {
  it('renders NavBar and Outlet', () => {
    // Mock the authentication state
    (useAuth as jest.Mock).mockReturnValue({ token: 'mock-token' });

    // Render the component
    render(<App />);

    // Ensure NavBar is rendered
    expect(screen.getByText('NavBar')).toBeInTheDocument();

    // Ensure Outlet is rendered
    expect(screen.getByText('Outlet Component')).toBeInTheDocument();
  });

  it('renders correctly without authentication state', () => {
    // Mock the authentication state as null (not authenticated)
    (useAuth as jest.Mock).mockReturnValue(null);

    // Render the component
    render(<App />);

    // Ensure NavBar is rendered
    expect(screen.getByText('NavBar')).toBeInTheDocument();

    // Ensure Outlet is rendered
    expect(screen.getByText('Outlet Component')).toBeInTheDocument();
  });
});
