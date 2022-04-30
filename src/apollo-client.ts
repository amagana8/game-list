import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { store } from './store';

const HOST_URL = process.env.NEXT_PUBLIC_VERCEL_URL ?  `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3000';

const httpLink = createHttpLink({
  uri: `${HOST_URL}/api/graphql`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// setup authorization header
const authLink = setContext((_, { headers }) => {
  const token = store.getState().user.token;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
});

// setup apollo client for graphql api calls
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export { client };
