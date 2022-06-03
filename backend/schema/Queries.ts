import { gql } from 'apollo-server-micro';

export const queries = gql`
  type Query {
    searchCompanies(query: String): [Company!]!
      @cypher(
        statement: "MATCH (c:Company) WHERE toLower(c.name) CONTAINS toLower($query) RETURN c LIMIT 50"
      )
  }
`;
