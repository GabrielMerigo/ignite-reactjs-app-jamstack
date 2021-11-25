import { render, screen } from '@testing-library/react';
import Home, { getStaticProps } from '../../pages';
import { stripe } from '../../services/stripe';
import { mocked } from 'ts-jest/utils'

jest.mock('next/router');
jest.mock('next-auth/client', () => {
  return {
    useSession: () => [null, false],
  }
});

jest.mock('../../services/stripe')

describe('Home page', () => {
  it('renders correctly', () => {
    render(<Home product={{ amount: 'fake amount', priceId: 'fake priceId'  }} />)
    expect(screen.getByText('for fake amount month')).toBeInTheDocument();
  });

  it('loads initial data', async () => {
    const retrivesStripePriceMocked = mocked(stripe.prices.retrieve);

    retrivesStripePriceMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000
    } as any)

    const response = await getStaticProps({})
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10.00'
          }
        }
      })
    )
  });
})