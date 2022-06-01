import { ApolloServer } from 'apollo-server-micro';
import { Neo4jGraphQL } from '@neo4j/graphql';
import neo4j from 'neo4j-driver';
import { OGM } from '@neo4j/graphql-ogm';
import { Neo4jGraphQLAuthJWTPlugin } from '@neo4j/graphql-plugin-auth';
import { resolvers } from '@backend/resolvers';
import Cors from 'micro-cors';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const cors = Cors();

const typeDefs = readFileSync(resolve('backend', 'schema.graphql')).toString(
  'utf-8',
);

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
);

const ogm = new OGM({
  typeDefs,
  driver,
  config: {
    enableRegex: true,
  },
});

export const User = ogm.model('User');

export default cors(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }

  const neoSchema = new Neo4jGraphQL({
    typeDefs,
    driver,
    resolvers,
    plugins: {
      auth: new Neo4jGraphQLAuthJWTPlugin({ secret: process.env.JWT_SECRET }),
    },
  });
  const schema = await neoSchema.getSchema();
  await neoSchema.assertIndexesAndConstraints({ options: { create: true } });
  const apolloServer = new ApolloServer({
    schema: schema,
    context: ({ req }) => ({ req }),
  });
  await ogm.init();
  await apolloServer.start();
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
});

export const config = {
  api: {
    bodyParser: false,
  },
};
