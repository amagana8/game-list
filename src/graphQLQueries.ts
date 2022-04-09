import { gql } from "@apollo/client";

export const GetList = gql`
  query ($userName: String, $status: status) {
    getUser(username: $userName) {
      gameList(filter: { status: { eq: $status } }) {
        id
        hours
        score
        game {
          title
        }
      }
    }
  }
`;
