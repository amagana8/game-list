import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
  NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useMemo } from 'react';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { useAuthStore } from '@frontend/authStore';
import { decode } from 'jsonwebtoken';
import { HOST_URL } from '@utils/hostUrl';

const httpLink = createHttpLink({
  uri: `${HOST_URL}/api/graphql`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

function createApolloClient() {
  // create token refresh link
  const refreshLink = new TokenRefreshLink({
    accessTokenField: 'accessToken',
    isTokenValidOrUndefined: () => {
      const token = useAuthStore.getState().accessToken;

      if (!token) {
        return true;
      }

      try {
        const { exp } = decode(token) as any;
        if (Date.now() >= exp * 1000) {
          return false;
        } else {
          return true;
        }
      } catch {
        return false;
      }
    },
    fetchAccessToken: () => {
      return fetch(`${HOST_URL}/api/refresh_token`, {
        method: 'POST',
        credentials: 'include',
      });
    },
    handleFetch: (accessToken) => {
      useAuthStore.setState((state) => ({ ...state, accessToken }));
    },
    handleError: (err) => {
      console.warn('Your refresh token is invalid. Try to re-login');
      console.error(err);
    },
  });

  // setup authorization header
  const authLink = setContext((_, { headers }) => {
    const token = useAuthStore.getState().accessToken;

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: ApolloLink.from([refreshLink, authLink, httpLink]),
    cache: new InMemoryCache(),
  });
}

let apolloClient: ApolloClient<NormalizedCacheObject>;

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
