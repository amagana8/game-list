export const roundNumber = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};
