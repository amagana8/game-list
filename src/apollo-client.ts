import { ApolloClient, InMemoryCache } from '@apollo/client';

const HOST_URL = process.env.NEXT_PUBLIC_VERCEL_URL ?  `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3000';

// setup apollo client for graphql api calls
const client = new ApolloClient({
  uri: `${HOST_URL}/api/graphql`,
  cache: new InMemoryCache(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export { client };
