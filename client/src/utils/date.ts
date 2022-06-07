export const StringDate = (date?: string) => (date !== undefined ? new Date(date!).toISOString().split("T")[0] : " ");

export const CompDates = (date1: string, date2: string) => {
  let d1 = new Date(date1);
  let d2 = new Date(date2);

  if (d1.getFullYear() > d2.getFullYear()) return 1;
  else if (d1.getFullYear() < d2.getFullYear()) return -1;

  if (d1.getMonth() > d2.getMonth()) return 1;
  else if (d1.getMonth() < d2.getMonth()) return -1;

  if (d1.getDate() > d2.getDate()) return 1;
  else if (d1.getDate() < d2.getDate()) return -1;

  return 0;
};
