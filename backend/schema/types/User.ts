import { gql } from 'apollo-server-micro';

export const userTypeDef = gql`
  type User
    @exclude(operations: [CREATE, DELETE])
    @fulltext(indexes: [{ name: "userName", fields: ["username"] }])
    @auth(
      rules: [
        { operations: [UPDATE, CONNECT, DISCONNECT], allow: { id: "$jwt.sub" } }
      ]
    ) {
    id: ID! @id @auth(rules: [{ allow: { id: "$jwt.sub" } }])
    username: String! @unique @readonly
    email: String!
      @unique
      @readonly
      @auth(rules: [{ allow: { id: "$jwt.sub" } }])
    password: String! @private
    tokenVersion: Int! @default(value: 0) @private
    createdAt: DateTime! @timestamp(operations: [CREATE])
    gameList: [Game!]!
      @relationship(type: "LISTED", properties: "ListEntry", direction: OUT)
    gameReviews: [Review!]! @relationship(type: "WROTE_REVIEW", direction: OUT)
    favoriteGames: [Game!]! @relationship(type: "FAVORITED", direction: OUT)
    following: [User!]!
      @cypher(statement: "MATCH (this)-[:FOLLOWS]->(u:User) RETURN u")
    followers: [User!]!
      @cypher(statement: "MATCH (this)<-[:FOLLOWS]-(u:User) RETURN u")
    genreDistribution: [GenreCount!]!
      @cypher(
        statement: "MATCH (this)-[:LISTED]->(:Game)-[:IN_GENRE]->(g:Genre)  WITH g.name AS genreName, COUNT(g) AS genreAmount RETURN ({genre: genreName, amount: genreAmount})"
      )
    scoreDistribution: [ScoreCount!]!
      @cypher(
        statement: """
        MATCH (this)-[r:LISTED]->(g:Game)
        WHERE r.score IS NOT NULL
        WITH round(r.score) AS scoreValue, COUNT(r.score) AS scoreCount
        ORDER BY scoreValue
        RETURN ({score: scoreValue, amount: scoreCount})
        """
      )
    followersPlaying(gameId: String!): [User!]!
      @cypher(
        statement: """
        MATCH (this)-[:FOLLOWS]->(u:User)-[:LISTED]->(g:Game {id: $gameId})
        RETURN u
        """
      )
    followingActivity: [UserActivity!]!
      @cypher(
        statement: """
        MATCH (this)-[:FOLLOWS]->(u:User)-[r:LISTED]->(g:Game)
        RETURN ({user: u.username, status: r.status, date: coalesce(r.updatedAt, r.createdAt), gameTitle: g.title, gameSlug: g.slug, gameCover: g.cover})
        ORDER BY coalesce(r.updatedAt, r.createdAt) DESC
        LIMIT 50
        """
      )
  }
`;
