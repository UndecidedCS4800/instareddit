import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from '../components/auth';
import MainRouter from '../Router';
import '@testing-library/jest-dom';

// Mock the necessary imports
jest.mock('../Router', () => jest.fn(() => <div>MainRouter Component</div>));
jest.mock('../components/auth', () => ({
  AuthProvider: jest.fn(({ children }: { children: React.ReactNode }) => <div>{children}</div>),
}));

describe('Index entry point', () => {
  it('renders AuthProvider and MainRouter', () => {
    // Create a mock div to render the component into
    const div = document.createElement('div');
    document.body.appendChild(div);

    // Render the component in strict mode
    createRoot(div).render(
      <StrictMode>
        <AuthProvider>
          <MainRouter />
        </AuthProvider>
      </StrictMode>
    );

  });
});
