import { gql } from 'apollo-server-micro';

export const mutations = gql`
  type Mutation {
    signUp(username: String!, email: String!, password: String!): AuthResponse!
    signIn(email: String!, password: String!): AuthResponse!
    updateUserDetails(
      username: String!
      newUsername: String
      newEmail: String
    ): String!
    signOut: Boolean!
    forgotPassword(email: String!): Boolean!
    changePassword(token: String!, newPassword: String!): AuthResponse!
  }
`;
