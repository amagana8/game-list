import { gql } from 'apollo-server-micro';

export const queries = gql`
  type Query {
    searchCompanies(query: String): [Company!]!
      @cypher(
        statement: "MATCH (c:Company) WHERE toLower(c.name) CONTAINS toLower($query) RETURN c LIMIT 50"
      )
    topGames(limit: Int!, offset: Int!): [Game!]!
      @cypher(
        statement: """
        MATCH (:User)-[r:LISTED]->(g:Game)
        WHERE r.score IS NOT NULL
        WITH g as game, max(r.score) as score
        RETURN game
        ORDER BY score DESC
        SKIP $offset
        LIMIT $limit
        """
      )
  }
`;
