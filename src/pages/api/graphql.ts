import { gql, ApolloServer } from 'apollo-server-micro';
import { Neo4jGraphQL } from '@neo4j/graphql';
import neo4j from 'neo4j-driver';
import { OGM } from '@neo4j/graphql-ogm';
import { Neo4jGraphQLAuthJWTPlugin } from '@neo4j/graphql-plugin-auth';
import { sign } from 'jsonwebtoken';
import argon2 from 'argon2';
import Cors from 'micro-cors';
import { Source } from 'graphql';
import { UserForm, UpdateUserForm } from 'src/types';

const cors = Cors();

const typeDefs = gql`
  type User @exclude(operations: [CREATE, DELETE]) {
    id: ID! @id @auth(rules: [{ allow: { id: "$jwt.sub" } }])
    username: String! @unique @readonly
    email: String! @unique @readonly @auth(rules: [{ allow: { id: "$jwt.sub" } }])
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
    developers: [String!]!
    publishers: [String!]!
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
    signUp(username: String!, email: String!, password: String!): String!
    signIn(email: String!, password: String!): String!
    updateUserDetails(
      username: String!
      newUsername: String
      newEmail: String
    ): String!
  }

  extend type Game @auth(rules: [
    {
      operations: [CREATE, UPDATE],
      isAuthenticated: true
    }
  ])

  extend type User @auth(rules: [
    {
      operations: [UPDATE, CONNECT, DISCONNECT],
      allow: { id: "$jwt.sub" }
    }
  ])
`;

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
);

const ogm = new OGM({ typeDefs, driver });
const User = ogm.model('User');

const resolvers = {
  Mutation: {
    signUp: async (
      _source: Source,
      { username, email, password }: UserForm,
    ) => {
      const [existingUsername] = await User.find({
        where: {
          username,
        },
      });

      if (existingUsername) {
        throw new Error(`User with username ${username} already exists!`);
      }

      const [existingEmail] = await User.find({
        where: {
          email,
        },
      });

      if (existingEmail) {
        throw new Error(`User with email ${email} already exists!`);
      }

      password = await argon2.hash(password);

      const { users } = await User.create({
        input: [
          {
            username,
            email,
            password,
          },
        ],
      });

      return sign(
        { sub: users[0].id, username: users[0].username },
        process.env.JWT_SECRET,
      );
    },
    signIn: async (_source: Source, { email, password }: UserForm) => {
      const [user] = await User.find({
        where: {
          email,
        },
      });

      if (!user) {
        throw new Error(`User with email ${email} not found!`);
      }

      const correctPassword = await argon2.verify(user.password, password);

      if (!correctPassword) {
        throw new Error(`Incorrect password for user with email ${email}!`);
      }

      return sign(
        { sub: user.id, username: user.username },
        process.env.JWT_SECRET,
      );
    },
    updateUserDetails: async (
      _source: Source,
      { username, newUsername, newEmail }: UpdateUserForm,
      context: any
    ) => {
      const [user] = await User.find({
        where: {
          username,
        },
      });

      if (!context.auth.jwt || user.id !== context.auth.jwt.sub) {
        throw new Error('Unauthorized request. Please login and try again.');
      }

      if (newUsername) {
        const [existingUsername] = await User.find({
          where: {
            username: newUsername,
          },
        });

        if (existingUsername) {
          throw new Error(`User with username ${newUsername} already exists!`);
        } else {
          User.update({
            where: {
              username,
            },
            update: {
              username: newUsername,
            },
          });
        }
      }

      if (newEmail) {
        const [existingEmail] = await User.find({
          where: {
            email: newEmail,
          },
        });

        if (existingEmail) {
          throw new Error(`User with email ${newEmail} already exists!`);
        } else {
          User.update({
            where: {
              username,
            },
            update: {
              email: newEmail,
            },
          });
        }
      }

      if (newUsername) {
        return newUsername;
      } else {
        return username;
      }
    },
  },
};

export default cors(async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  // res.setHeader(
  //   'Access-Control-Allow-Origin',
  //   'https://studio.apollographql.com',
  // );
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
    context: ({req}) => {
      return {
        req,
      };
    },
  });
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
