export enum Status {
  Playing = 'playing',
  Completed = 'completed',
  Paused = 'paused',
  Dropped = 'dropped',
  Planning = 'planning',
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
