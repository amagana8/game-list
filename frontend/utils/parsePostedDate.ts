import { parseDate } from './parseDate';

const minute = 60 * 1000;
const hour = 60 * minute;
const day = 24 * hour;
const week = 7 * day;

export const parsePostedDate = (dateString: string) => {
  const date = new Date(dateString).getTime();
  const now = new Date().getTime();
  const diff = now - date;
  if (diff < minute) {
    return `${Math.floor(diff / 1000)} seconds ago`;
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)} minutes ago`;
  } else if (diff < day) {
    return `${Math.floor(diff / hour)} hours ago`;
  } else if (diff < week) {
    return `${Math.floor(diff / day)} days ago`;
  } else {
    return parseDate(dateString);
  }
};
