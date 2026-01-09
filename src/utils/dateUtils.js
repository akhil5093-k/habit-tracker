export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

export const getTodayString = () => {
  return formatDate(new Date());
};

export const getWeekDates = () => {
  const today = new Date();
  const dates = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(formatDate(date));
  }
  
  return dates;
};

export const calculateStreak = (completions) => {
  const sortedCompletions = completions
    .filter(c => c.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sortedCompletions.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < sortedCompletions.length; i++) {
    const completionDate = new Date(sortedCompletions[i].date);
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    
    if (formatDate(completionDate) === formatDate(expectedDate)) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};