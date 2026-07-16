import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import PageNotFound from '../src/pages/PageNotFound/PageNotFound';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('PageNotFound', () => {
  test('renders 404 page', () => {
    render(
      <MemoryRouter>
        <PageNotFound />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: '404 - Page Not Found' })
    ).toBeInTheDocument();

    expect(
      screen.getByText('The page you are looking for does not exist.')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'GO TO HOMEPAGE' })
    ).toBeInTheDocument();
  });

  test('navigates to home page when button is clicked', () => {
    render(
      <MemoryRouter>
        <PageNotFound />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'GO TO HOMEPAGE' })
    );

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});