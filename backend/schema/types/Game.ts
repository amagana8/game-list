import { gql } from 'apollo-server-micro';

export const gameTypeDef = gql`
  type Game
    @exclude(operations: [DELETE])
    @fulltext(indexes: [{ name: "GameTitle", fields: ["title", "slug"] }])
    @auth(rules: [{ operations: [CREATE, UPDATE], isAuthenticated: true }]) {
    id: ID! @id
    slug: String! @unique
    createdAt: DateTime @timestamp(operations: [CREATE])
    title: String
    cover: String
    developers: [Company!]! @relationship(type: "DEVELOPED_BY", direction: OUT)
    publishers: [Company!]! @relationship(type: "PUBLISHED_BY", direction: OUT)
    platforms: [Platform!]! @relationship(type: "ON_PLATFORM", direction: OUT)
    genres: [Genre!]! @relationship(type: "IN_GENRE", direction: OUT)
    summary: String
    releaseDate: DateTime
    userList: [User!]!
      @relationship(type: "LISTED", properties: "ListEntry", direction: IN)
    userReviews: [Review!]! @relationship(type: "REVIEW_OF", direction: IN)
    scoreDistribution: [ScoreCount!]!
      @cypher(
        statement: """
        MATCH (this)<-[r:LISTED]-(u:User)
        WHERE r.score IS NOT NULL
        WITH round(r.score) AS scoreValue, COUNT(r.score) AS scoreCount
        ORDER BY scoreValue
        RETURN ({score: scoreValue, amount: scoreCount})
        """
      )
  }
`;
