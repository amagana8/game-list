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
    follow(user: String!): Boolean!
      @cypher(
        statement: """
        MATCH (a:User {id: $auth.jwt.sub})
        WITH a
        MATCH (b:User {username: $user})
        MERGE (a)-[r:FOLLOWS]->(b)
        RETURN apoc.convert.toBoolean(COUNT(r))
        """
      )
    unFollow(user: String!): Boolean!
      @cypher(
        statement: """
        MATCH (a:User {id: $auth.jwt.sub})-[r:FOLLOWS]->(b:User {username: $user})
        DELETE r
        RETURN NOT EXISTS( (a)-[:FOLLOWS]->(b))
        """
      )
  }
`;
