import { render, screen, fireEvent } from '@testing-library/react';
import { SubscribeButton } from '.';
import { signIn, useSession } from 'next-auth/client';
import { mocked } from 'ts-jest/utils';
import { useRouter } from 'next/router';

jest.mock('next-auth/client')
jest.mock('next/router')

describe('SubscribeButton Component', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false])

    render(<SubscribeButton />);
    expect(screen.getByText('Subscribe now')).toBeInTheDocument();
  });

  it('redirects user to sign in when not authenticated', () => {
    const signInMocked = mocked(signIn);
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false])

    render(<SubscribeButton />);
    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton)
    expect(signInMocked).toHaveBeenCalled();
  });

  it('redirects to posts when user already has a subscruption', () => {
    const userRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce([
      {
        user: { name: "John Doe", email: 'John.doe@example' },
        activeSubscription: 'fake-active-subscribeButton',
        expires: 'fake-espires'
      },
      false
    ]);

    userRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(<SubscribeButton />);
    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton);
    expect(pushMock).toHaveBeenCalledWith('/posts');
  })
})