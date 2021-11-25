import { render, screen } from '@testing-library/react';
import { getSession } from 'next-auth/client';
import { mocked } from 'ts-jest/utils';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';

const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  content: '<p>Post excerpt</p>',
  updatedAt: 'March, 10'
};

jest.mock('../../services/prismic');
jest.mock('next-auth/client');

describe('Post page', () => {
  it('renders correctly', () => {
    render(<Post post={post} />)
    expect(screen.getByText('My New Post')).toBeInTheDocument();
    expect(screen.getByText('Post excerpt')).toBeInTheDocument();
  });

  it('redirects user to full posts when authenticated', async () => {
    const getSessionMocked = mocked(getSession);
    getSessionMocked.mockResolvedValueOnce(null);
    
    const response = await getServerSideProps({ params: { slug: 'my-new-post' } } as any)
    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/'
        })
      })
    )
  });

  it('loads inital data', async () => {
    const getSessionMocked = mocked(getSession);
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: 'heading', text: 'My new Post' }
          ],
          content: [
            { type: 'paragraph', text: 'Post excerpt' }
          ],
        },
        last_publication_date: '11-24-2021'
      })
    } as any)

    getSessionMocked.mockResolvedValue({
      activeSubscription: 'fake-active-subscription'
    } as any);

    const response = await getServerSideProps({ params: { slug: 'my-new-post' } } as any)
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My new Post',
            content: '<p>Post excerpt</p>',
            updatedAt: '24 de novembro de 2021'
          }
        }
      })
    )
  });
})