import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useMemo } from 'react';

let HOST_URL;
if (process.env.NETLIFY) {
  HOST_URL = 'https://game-list-preview.netlify.app';
} else if (process.env.NEXT_PUBLIC_VERCEL_URL) {
  HOST_URL = 'https://game-list-preview.vercel.app';
} else {
  HOST_URL = 'http://localhost:3000';
}

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

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
}

let apolloClient: any;

export function initializeApollo(initialState: any = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState: any) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
