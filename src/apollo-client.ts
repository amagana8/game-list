import { ApolloClient, InMemoryCache } from '@apollo/client';

// setup apollo client for graphql api calls
const client = new ApolloClient({
    uri: 'https://blue-surf-550142.us-east-1.aws.cloud.dgraph.io/graphql',
    cache: new InMemoryCache(),
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export { client };
