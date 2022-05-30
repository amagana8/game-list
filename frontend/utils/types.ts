export interface UserForm {
  email: string;
  username: string;
  password: string;
}

export interface UpdateUserForm {
  username: string;
  newUsername?: string;
  newEmail?: string;
}

export interface Game {
  id: string;
  slug: string;
  title: string;
  cover: string;
  publishers: Company[];
  developers: Company[];
  summary: string;
  genres: Genre[];
  releaseDate: string;
  userReviews: Review[];
  userListAggregate: { edge: { score: { average: number } } };
}
export interface Company {
  name: string;
}

export interface Genre {
  id: string;
  name: string;
}

export interface User {
  username: string;
  gameListAggregate: { edge: { hours: { sum: number } } };
}
export interface Review {
  id: string;
  summary: string;
  body: string;
  author: User;
  subject: Game;
  updatedAt: string;
  createdAt: string;
}
