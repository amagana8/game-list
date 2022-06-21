import { gql } from '@apollo/client';
import { GameFragment } from './fragments';

export const SignUp = gql`
  mutation SignUp($username: String!, $email: String!, $password: String!) {
    signUp(username: $username, email: $email, password: $password) {
      username
      accessToken
    }
  }
`;

export const SignIn = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      username
      accessToken
    }
  }
`;

export const SignOut = gql`
  mutation SignOut {
    signOut
  }
`;

export const AddGame = gql`
  mutation UpdateUsers($where: UserWhere, $connect: UserConnectInput) {
    updateUsers(where: $where, connect: $connect) {
      info {
        relationshipsCreated
      }
    }
  }
`;

export const RemoveGame = gql`
  mutation UpdateUsers($where: UserWhere, $disconnect: UserDisconnectInput) {
    updateUsers(where: $where, disconnect: $disconnect) {
      info {
        relationshipsDeleted
      }
    }
  }
`;

export const NewGame = gql`
  mutation CreateGames($input: [GameCreateInput!]!) {
    createGames(input: $input) {
      games {
        ...GameFragment
      }
    }
  }
  ${GameFragment}
`;

export const UpdateUserDetails = gql`
  mutation UpdateUserDetails(
    $username: String!
    $newUsername: String
    $newEmail: String
  ) {
    updateUserDetails(
      username: $username
      newUsername: $newUsername
      newEmail: $newEmail
    )
  }
`;

export const NewReview = gql`
  mutation CreateReviews($input: [ReviewCreateInput!]!) {
    createReviews(input: $input) {
      reviews {
        id
        body
        summary
        createdAt
        updatedAt
        author {
          username
        }
        subject {
          title
        }
      }
    }
  }
`;

export const UpdateReview = gql`
  mutation UpdateReviews($update: ReviewUpdateInput, $where: ReviewWhere) {
    updateReviews(update: $update, where: $where) {
      reviews {
        body
        summary
      }
    }
  }
`;

export const DeleteReview = gql`
  mutation DeleteReviews($where: ReviewWhere) {
    deleteReviews(where: $where) {
      nodesDeleted
    }
  }
`;

export const AddFavoriteGame = gql`
  mutation UpdateUsers($where: UserWhere, $connect: UserConnectInput) {
    updateUsers(where: $where, connect: $connect) {
      info {
        relationshipsCreated
      }
    }
  }
`;

export const RemoveFavoriteGame = gql`
  mutation UpdateUsers($where: UserWhere, $disconnect: UserDisconnectInput) {
    updateUsers(where: $where, disconnect: $disconnect) {
      info {
        relationshipsDeleted
      }
    }
  }
`;

export const ForgotPassword = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

export const ChangePassword = gql`
  mutation ChangePassword($token: String!, $newPassword: String!) {
    changePassword(token: $token, newPassword: $newPassword) {
      username
      accessToken
    }
  }
`;
