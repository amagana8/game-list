import { gql } from 'apollo-server-micro';

export const ReviewTypeDef = gql`
  type Review
    @exclude(operations: [CONNECT, DISCONNECT])
    @auth(
      rules: [
        {
          operations: [CREATE, UPDATE, DELETE]
          allow: { author: { id: "$jwt.sub" } }
        }
      ]
    ) {
    id: ID! @id
    body: String!
    summary: String
    createdAt: DateTime! @timestamp(operations: [CREATE])
    updatedAt: DateTime @timestamp(operations: [UPDATE])
    author: User! @relationship(type: "WROTE_REVIEW", direction: IN)
    subject: Game! @relationship(type: "REVIEW_OF", direction: OUT)
  }
`;
