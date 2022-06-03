import { gql } from 'apollo-server-micro';

export const mutations = gql`
  type Mutation {
    signUp(username: String!, email: String!, password: String!): String!
    signIn(email: String!, password: String!): String!
    updateUserDetails(
      username: String!
      newUsername: String
      newEmail: String
    ): String!
  }
`;
