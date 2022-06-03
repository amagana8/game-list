import { ApolloServer } from 'apollo-server-micro';
import { Neo4jGraphQL } from '@neo4j/graphql';
import neo4j from 'neo4j-driver';
import { OGM } from '@neo4j/graphql-ogm';
import { Neo4jGraphQLAuthJWTPlugin } from '@neo4j/graphql-plugin-auth';
import Cors from 'micro-cors';
import { companyTypeDef } from '@schema/types/Company';
import { gameTypeDef } from '@schema/types/Game';
import { genreTypeDef } from '@schema/types/Genre';
import { GenreCountTypeDef } from '@schema/types/GenreCount';
import { ReviewTypeDef } from '@schema/types/Review';
import { ScoreCountTypeDef } from '@schema/types/ScoreCount';
import { userTypeDef } from '@schema/types/User';
import { statusTypeDef } from '@schema/enums/Status';
import { listEntryTypeDef } from '@schema/interfaces/ListEntry';
import { queries } from '@schema/Queries';
import { mutations } from '@schema/Mutations';
import { signUp } from '@resolvers/SignUp';
import { signIn } from '@resolvers/SignIn';
import { updateUser } from '@resolvers/UpdateUser';

const cors = Cors();

const typeDefs = [
  companyTypeDef,
  gameTypeDef,
  genreTypeDef,
  GenreCountTypeDef,
  ReviewTypeDef,
  ScoreCountTypeDef,
  userTypeDef,
  statusTypeDef,
  listEntryTypeDef,
  queries,
  mutations,
];

const resolvers = {
  Mutation: {
    ...signUp,
    ...signIn,
    ...updateUser,
  },
};

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

export const server = cors(async (req, res) => {
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
