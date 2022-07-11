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
        WITH g as game, AVG(r.score) as score
        RETURN game
        ORDER BY score DESC
        SKIP $offset
        LIMIT $limit
        """
      )
    isFollowing(follower: String!, followee: String!): Boolean!
      @cypher(
        statement: " MATCH (a:User {username: $follower})-[r:FOLLOWS]->(b:User {username: $followee}) RETURN apoc.convert.toBoolean(COUNT(r))"
      )
    globalActivity: [UserActivity!]!
      @cypher(
        statement: """
        MATCH (u:User)-[r:LISTED]->(g:Game)
        RETURN ({user: u.username, status: r.status, date: coalesce(r.updatedAt, r.createdAt), gameTitle: g.title, gameSlug: g.slug, gameCover: g.cover})
        ORDER BY coalesce(r.updatedAt, r.createdAt) DESC
        LIMIT 50
        """
      )
    usersWithMostGamesPlayed: [UserCount!]!
      @cypher(
        statement: """
        MATCH (u:User)-[r:LISTED]-(g:Game)
        WHERE r.status <> 'PLANNING'
        WITH COUNT(r) AS  gameCount, u.username AS username
        RETURN ({user: username, amount: gameCount})
        ORDER BY gameCount DESC
        LIMIT 50
        """
      )
  }
`;
