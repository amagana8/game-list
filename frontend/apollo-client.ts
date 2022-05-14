import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const HOST_URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? 'https://game-list-preview.vercel.app'
  : 'http://localhost:3000';

const httpLink = createHttpLink({
  uri: `${HOST_URL}/api/graphql`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// setup authorization header
const authLink = setContext((_, { headers }) => {
  let token = '';
  if (typeof window !== 'undefined') {
    const storeString = localStorage.getItem('persist:root');
    if (storeString) {
      const store = JSON.parse(storeString);
      token = JSON.parse(store.user).token;
    }
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// setup apollo client for graphql api calls
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export { client };
