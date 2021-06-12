import { render, screen } from '@testing-library/react';
import App from '../containers/App';

test('renders loading text', () => {
  render(<App />);
  const text = screen.getByText(/Loading vaccination data\.\.\./i);
  expect(text).toBeInTheDocument();
});
