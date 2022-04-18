import { gql, ApolloServer } from 'apollo-server-micro';
import { Neo4jGraphQL } from '@neo4j/graphql';
import neo4j from 'neo4j-driver';
import { OGM } from '@neo4j/graphql-ogm';
import { Neo4jGraphQLAuthJWTPlugin } from '@neo4j/graphql-plugin-auth';
import { sign } from 'jsonwebtoken';
import argon2 from 'argon2';

const typeDefs = gql`
  type User @exclude(operations: [CREATE, DELETE]) {
    id: ID! @id
    username: String! @unique
    password: String! @private
    gamesPlaying: [Game!]!
      @relationship(type: "IS_PLAYING", properties: "Status", direction: OUT)
    gamesCompleted: [Game!]!
      @relationship(type: "HAS_COMPLETED", properties: "Status", direction: OUT)
    gamesPaused: [Game!]!
      @relationship(type: "HAS_PAUSED", properties: "Status", direction: OUT)
    gamesDropped: [Game!]!
      @relationship(type: "HAS_DROPPED", properties: "Status", direction: OUT)
    gamesPlanning: [Game!]!
      @relationship(type: "IS_PLANNING", properties: "Status", direction: OUT)
  }

  type Game @exclude(operations: [DELETE]) {
    id: ID! @id
    title: String
    developer: String
    publisher: String
    genre: Genre
    summary: String
    usersPlaying: [User!]!
      @relationship(type: "IS_PLAYING", properties: "Status", direction: IN)
    usersCompleted: [User!]!
      @relationship(type: "HAS_COMPLETED", properties: "Status", direction: IN)
    usersPaused: [User!]!
      @relationship(type: "HAS_PAUSED", properties: "Status", direction: IN)
    usersDropped: [User!]!
      @relationship(type: "HAS_DROPPED", properties: "Status", direction: IN)
    usersPlanning: [User!]!
      @relationship(type: "IS_PLANNING", properties: "Status", direction: IN)
  }

  interface Status @relationshipProperties {
    hours: Int
    score: Int
  }

  enum Genre {
    adventure
    board
    fighting
    horror
    racing
    rpg
    rhythm
    sandbox
    shooter
    simulation
    sports
    strategy
  }

  type Mutation {
    signUp(username: String!, password: String!): String!
    signIn(username: String!, password: String!): String!
  }
`;

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
);

const ogm = new OGM({ typeDefs, driver });
const User = ogm.model('User');

const resolvers = {
  Mutation: {
    signUp: async (_source: any, { username, password }: any) => {
      const [existing] = await User.find({
        where: {
          username,
        },
      });

      if (existing) {
        throw new Error(`User with username ${username} already exists!`);
      }

      password = await argon2.hash(password);

      const { users } = await User.create({
        input: [
          {
            username,
            password,
          },
        ],
      });

      return sign({ sub: users[0].id }, process.env.JWT_SECRET);
    },
    signIn: async (_source: any, { username, password }: any) => {
      const [user] = await User.find({
        where: {
          username,
        },
      });

      if (!user) {
        throw new Error(`User with username ${username} not found!`);
      }

      const correctPassword = await argon2.verify(user.password, password);

      if (!correctPassword) {
        throw new Error(
          `Incorrect password for user with username ${username}!`,
        );
      }

      return sign({ sub: user.id }, process.env.JWT_SECRET);
    },
  },
};

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://studio.apollographql.com',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
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

  await ogm.init();
  const apolloServer = new ApolloServer({
    schema: await neoSchema.getSchema(),
  });
  await apolloServer.start();
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
