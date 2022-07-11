import { gql } from 'apollo-server-micro';

export const UserCountTypeDef = gql`
  type UserCount @exclude {
    user: String!
    amount: Int!
  }
`;
