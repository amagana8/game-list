import { ApolloClient, InMemoryCache } from '@apollo/client';
import config from '../config.json';

// setup apollo client for graphql api calls
const client = new ApolloClient({
    uri: config.graphqlUrl,
    cache: new InMemoryCache(),
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export { client };
