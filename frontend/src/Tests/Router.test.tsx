import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainRouter from '../Router';

// Mock the necessary components used in the router
jest.mock('../About', () => () => <div>About Page</div>);
jest.mock('../Login', () => () => <div>Login Page</div>);
jest.mock('../components/CenterPane', () => () => <div>CenterPane</div>);
jest.mock('../components/Community', () => () => <div>Community Page</div>);
jest.mock('../components/Post', () => () => <div>Post Page</div>);
jest.mock('../components/CreatePost', () => () => <div>Create Post Page</div>);
jest.mock('../ChatPage', () => () => <div>Chat Page</div>);
jest.mock('../Notifications', () => () => <div>Notifications Page</div>);
jest.mock('../components/ProfilePage', () => () => <div>Profile Page</div>);

// Mock socket object (or import the socket and mock it properly)
jest.mock('../socket', () => ({
  connect: jest.fn(),  // Mock the connect method
  auth: { token: '' }  // Mock the auth object
}));

describe('MainRouter', () => {
  it('renders the CenterPane component on the root path', () => {
    render(
      <Router>
        <MainRouter />
      </Router>
    );

    // Ensure that CenterPane is rendered for the root path
    expect(screen.getByText('CenterPane')).toBeInTheDocument();
  });

  it('renders the About component when navigating to /about', () => {
    render(
      <Router>
        <MainRouter />
      </Router>
    );

    // Simulate navigation to /about
    fireEvent.click(screen.getByText('About'));

    // Ensure About Page is rendered
    expect(screen.getByText('About Page')).toBeInTheDocument();
  });

  it('renders the Login component when navigating to /login', () => {
    render(
      <Router>
        <MainRouter />
      </Router>
    );

    // Simulate navigation to /login
    fireEvent.click(screen.getByText('Login'));

    // Ensure Login Page is rendered
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders the Community component when navigating to /community/:communityid', () => {
    render(
      <Router>
        <MainRouter />
      </Router>
    );

    // Simulate navigation to a community route
    fireEvent.click(screen.getByText('Community'));

    // Ensure Community Page is rendered
    expect(screen.getByText('Community Page')).toBeInTheDocument();
  });

  it('renders the Post component when navigating to /community/:communityid/posts/:postid', () => {
    render(
      <Router>
        <MainRouter />
      </Router>
    );

    // Simulate navigation to a post page
    fireEvent.click(screen.getByText('Post'));

    // Ensure Post Page is rendered
    expect(screen.getByText('Post Page')).toBeInTheDocument();
  });

  it('renders the ProfilePage component when navigating to /user/:username', () => {
    render(
      <Router>
        <MainRouter />
      </Router>
    );

    // Simulate navigation to a profile page
    fireEvent.click(screen.getByText('Profile'));

    // Ensure Profile Page is rendered
    expect(screen.getByText('Profile Page')).toBeInTheDocument();
  });
});
