import dayjs from 'dayjs';

export const schoolMateDateFormat = (date: Date) => {
  const todayDate = new Date();
  const targetDate = new Date(date);

  const betweenTime = Math.floor(
    (todayDate.getTime() - targetDate.getTime()) / 1000 / 60
  );

  if (betweenTime < 1) return '방금전';
  if (betweenTime < 60) {
    return `${betweenTime}분전`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간전`;
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  if (betweenTimeDay < 30) {
    return `${betweenTimeDay}일전`;
  }

  return dayjs(date).format('YYYY/MM/DD');
};
