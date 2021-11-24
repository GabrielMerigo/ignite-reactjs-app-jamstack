import { render, screen } from '@testing-library/react';
import { SignInButton } from '.';
import { mocked } from 'ts-jest/utils'
import { useSession } from 'next-auth/client';

jest.mock('next-auth/client')

describe('SignInButton Component', () => {
  it('renders correctly when user is not authenticated', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SignInButton />);
    expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
  });

  it('renders correctly when user is authenticated', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([{
      user: { name: "John Doe", email: 'John.doe@example' }, expires: 'fake-espires'},
      false
    ]);

    render(<SignInButton />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
})