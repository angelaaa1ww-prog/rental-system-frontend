import { render, screen } from '@testing-library/react';

jest.mock('@vercel/analytics/react', () => ({ Analytics: () => null }), { virtual: true });

import App from './App';

test('renders the secure rental sign-in experience', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /a clearer way to run your rental portfolio/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /owner sign-in/i })).toBeInTheDocument();
});