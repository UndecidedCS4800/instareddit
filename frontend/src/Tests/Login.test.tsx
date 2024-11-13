import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Login } from '../Login';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../remote';
import { useAuthDispatch } from '../components/auth';
import '@testing-library/jest-dom';


// Mock useNavigate and useAuthDispatch hooks
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../components/auth', () => ({
  useAuthDispatch: jest.fn(),
}));

jest.mock('../remote', () => ({
  loginUser: jest.fn(),
  registerUser: jest.fn(),
}));

describe('Login Component', () => {
  const mockNavigate = jest.fn();
  const mockDispatch = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAuthDispatch as jest.Mock).mockReturnValue(mockDispatch);
    jest.clearAllMocks();
  });

  test('renders login form correctly', () => {
    render(<Login />);
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('toggles to register form on clicking swap intent', () => {
    render(<Login />);

    // Click to swap intent to Register
    fireEvent.click(screen.getByText(/register/i));
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
  });

  test('submits login form successfully', async () => {
    const mockTokenResponse = { token: 'mock-token' };
    (loginUser as jest.Mock).mockResolvedValue(mockTokenResponse);

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith('testuser', 'password123');
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'login',
        payload: mockTokenResponse,
      });
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  test('displays error message on failed login', async () => {
    const mockError = { error: 'Invalid credentials' };
    (loginUser as jest.Mock).mockResolvedValue(mockError);

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'invalidUser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongPassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

  });

  test('submits register form successfully', async () => {
    const mockTokenResponse = { token: 'mock-token' };
    (registerUser as jest.Mock).mockResolvedValue(mockTokenResponse);

    render(<Login />);

    fireEvent.click(screen.getByText(/register/i));
    
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'newuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'newuser@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'newpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith('newuser', 'newuser@example.com', 'newpassword');
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'login',
        payload: mockTokenResponse,
      });
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });
});
