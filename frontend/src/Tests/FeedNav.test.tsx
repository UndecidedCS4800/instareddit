import { render, screen, fireEvent } from '@testing-library/react';
import { FeedNav } from '../components/FeedNav'; 
import '@testing-library/jest-dom';

describe('FeedNav Component', () => {
  const mockViewSetter = jest.fn();

  it('renders the navigation items correctly', () => {
    render(
      <FeedNav viewSetter={mockViewSetter} activeView="recent" />
    );

    // Check if both menu items are rendered
    expect(screen.getByText(/Recent Activity/i)).toBeInTheDocument();
    expect(screen.getByText(/Communities/i)).toBeInTheDocument();
  });

  it('applies active state to the "Recent Activity" menu item when activeView is "recent"', () => {
    render(
      <FeedNav viewSetter={mockViewSetter} activeView="recent" />
    );

    // Check if the "Recent Activity" item has the active class
    const recentActivityItem = screen.getByText(/Recent Activity/i);
    expect(recentActivityItem).toHaveClass('border-b-2');
    expect(recentActivityItem).toHaveClass('border-pink-400');
    expect(recentActivityItem).toHaveClass('text-pink-400');
  });

  it('applies active state to the "Communities" menu item when activeView is "community"', () => {
    render(
      <FeedNav viewSetter={mockViewSetter} activeView="community" />
    );

    // Check if the "Communities" item has the active class
    const communitiesItem = screen.getByText(/Communities/i);
    expect(communitiesItem).toHaveClass('border-b-2');
    expect(communitiesItem).toHaveClass('border-pink-400');
    expect(communitiesItem).toHaveClass('text-pink-400');
  });

  it('calls viewSetter with "recent" when "Recent Activity" is clicked', () => {
    render(
      <FeedNav viewSetter={mockViewSetter} activeView="recent" />
    );

    // Simulate clicking the "Recent Activity" item
    fireEvent.click(screen.getByText(/Recent Activity/i));

    // Ensure the viewSetter function is called with "recent"
    expect(mockViewSetter).toHaveBeenCalledWith("recent");
  });

  it('calls viewSetter with "community" when "Communities" is clicked', () => {
    render(
      <FeedNav viewSetter={mockViewSetter} activeView="recent" />
    );

    // Simulate clicking the "Communities" item
    fireEvent.click(screen.getByText(/Communities/i));

    // Ensure the viewSetter function is called with "community"
    expect(mockViewSetter).toHaveBeenCalledWith("community");
  });
});
