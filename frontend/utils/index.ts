export const roundNumber = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

export const parseDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};
