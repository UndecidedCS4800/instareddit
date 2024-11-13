import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserInfoDisplay from '../components/UserInfoDisplay';
import { UserMeta } from '../schema'; 
import '@testing-library/jest-dom';

describe('UserInfoDisplay Component', () => {
  const mockUiHandler = jest.fn();

  const mockUserMeta: UserMeta = {
    first_name: "John",
    last_name: "Doe",
    date_of_birth: "2000-01-01",
    profile_picture: null,
  };

  it('renders the Display component with user info when editable is false', () => {
    render(
      <UserInfoDisplay userinfo={mockUserMeta} editable={false} uiHandler={mockUiHandler} />
    );

    // Check if the user information is displayed
    expect(screen.getByText(/John/i)).toBeInTheDocument();
    expect(screen.getByText(/Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/2000-01-01/i)).toBeInTheDocument();
  });

  it('renders the editor when editable is true', () => {
    render(
      <UserInfoDisplay userinfo={mockUserMeta} editable={true} uiHandler={mockUiHandler} />
    );

    // Check if the editor fields are rendered
    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2000-01-01")).toBeInTheDocument();
  });

  it('calls uiHandler with updated user info when form is submitted', async () => {
    render(
      <UserInfoDisplay userinfo={mockUserMeta} editable={true} uiHandler={mockUiHandler} />
    );

    // Fill in the form fields
    fireEvent.change(screen.getByDisplayValue("John"), { target: { value: "Jane" } });
    fireEvent.change(screen.getByDisplayValue("Doe"), { target: { value: "Smith" } });
    fireEvent.change(screen.getByDisplayValue("2000-01-01"), { target: { value: "1995-05-10" } });

    // Submit the form
    fireEvent.click(screen.getByText(/Save/i));

    // Wait for uiHandler to be called
    await waitFor(() => {
      expect(mockUiHandler).toHaveBeenCalledWith({
        first_name: "Jane",
        last_name: "Smith",
        date_of_birth: "1995-05-10",
        profile_picture: null,
      });
    });
  });

  it('renders loading state when userinfo is null', () => {
    render(
      <UserInfoDisplay userinfo={null} editable={false} uiHandler={mockUiHandler} />
    );

    // Check if the "Loading..." text is displayed
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });
});
