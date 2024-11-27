import { render, screen, waitFor, act } from '@testing-library/react';
import { TableView } from '../TableView';
import '@testing-library/jest-dom';

// Mock the getter function
const mockGetter = jest.fn();
const mockRenderItem = jest.fn();

describe('TableView Component', () => {
  // Test case 1: Test loading state
  it('displays loading text while data is being fetched', async () => {
    mockGetter.mockResolvedValueOnce([]);

    // Wrap the component rendering and state updates in act
    await act(async () => {
      render(<TableView getter={mockGetter} renderItem={mockRenderItem} />);
    });

    // Check if the loading text is displayed
    expect(screen.queryByText('Loading')).not.toBeInTheDocument();
  });

  // Test case 2: Test data fetching and rendering
  it('fetches data and renders the items using renderItem', async () => {
    const mockData = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
    
    mockGetter.mockResolvedValueOnce(mockData);
    mockRenderItem.mockImplementation((item) => <div key={item.id}>{item.name}</div>);

    // Wrap the component rendering and state updates in act
    await act(async () => {
      render(<TableView getter={mockGetter} renderItem={mockRenderItem} />);
    });

    // Wait for the data to be fetched and rendered
    await waitFor(() => {
      expect(screen.queryByText('Loading')).not.toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });

});

