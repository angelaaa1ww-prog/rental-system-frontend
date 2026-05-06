import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app title', () => {
  render(<App />);
  const linkElement = screen.getByText(/Property Management System/i);
  expect(linkElement).toBeInTheDocument();
});
