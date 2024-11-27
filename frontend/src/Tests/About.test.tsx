import { render, screen } from '@testing-library/react';
import About from '../About';
import '@testing-library/jest-dom';

describe('About component', () => {
  it('renders the about page correctly with titles and meeting dates', () => {
    render(<About />);

    // Check for main headings
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('This is the About Us page.')).toBeInTheDocument();

    // Check for list items
    const listItems = ['Our Mission', 'Our Team', 'Contact Us', 'Meetings:'];
    listItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });

    // Check for each date
    const dates = [
      '9/3', '9/4', '9/5', '9/6', '9/9', '9/10', '9/11', '9/12',
      '9/13', '9/16', '9/17', '9/18', '9/19', '9/20', '9/23',
      '9/24', '9/25', '9/26', '9/27', '9/30', '10/1', '10/2',
      '10/3', '10/4', '10/7', '10/8', '10/9', '10/10', '10/11',
      '10/14', '10/15', '10/16', '10/17', '10/18', '10/21',
      '10/22', '10/24', '10/25', '10/28', '10/29', '10/30', 
      '10/31', '11/1', '11/4'
    ];

    dates.forEach(date => {
      expect(screen.getByText(date)).toBeInTheDocument();
    });
  });
});
