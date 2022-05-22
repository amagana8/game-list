export enum Status {
  Playing = 'playing',
  Completed = 'completed',
  Paused = 'paused',
  Dropped = 'dropped',
  Planning = 'planning',
}

export enum SearchType {
  Games = 'games',
  Users = 'users',
}

export enum ReviewGridType {
  Game = 'game',
  User = 'user',
}

export const scoreMap = new Map([
  ['ones', '1'],
  ['twos', '2'],
  ['threes', '3'],
  ['fours', '4'],
  ['fives', '5'],
  ['sixes', '6'],
  ['sevens', '7'],
  ['eights', '8'],
  ['nines', '9'],
  ['tens', '10'],
]);

export const colorMap = new Map([
  [1, '#a8071a'],
  [2, '#cf1322'],
  [3, '#d4380d'],
  [4, '#d46b08'],
  [5, '#d48806'],
  [6, '#d4b106'],
  [7, '#cad803'],
  [8, '#7cb305'],
  [9, '#59ad05'],
  [10, '#389e0d'],
]);
