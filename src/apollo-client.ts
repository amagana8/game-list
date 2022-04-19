import { ApolloClient, InMemoryCache } from '@apollo/client';

// setup apollo client for graphql api calls
const client = new ApolloClient({
  uri: 'http://localhost:3000/api/graphql',
  cache: new InMemoryCache(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export { client };
