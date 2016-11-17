const days = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

const getWeekNumber = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
};

const hasPaydayPastThisWeek = (date, payDay) => (new Date(date)).getDay() > days[payDay.weekDay];

// @todo make it check the payday
const doesWeekHavePaydayFortnight = (week, payDay) => getWeekNumber(week) % 2 === 1;

class TimeUtils {
  static getArrayOfWeeks(a, b) {
    const start = new Date(a);
    start.setUTCHours(0,0,0,0);
    const end = new Date(b);
    end.setUTCHours(0,0,0,0);

    const weeks = [start];

    // Let's just cap this loop. We should break beforehand though (should...)
    while (weeks.length < 500) {
      const futureDate = new Date(weeks[weeks.length - 1]);
      futureDate.setDate(futureDate.getDate() + 7);

      if (futureDate >= end) {
        break;
      }

      weeks.push(futureDate);
    }

    return weeks;
  }

  static getPaydayWeeks(payInterval, payDay, weeks) {
    if (payInterval === 'fortnight') {
      const firstWeek = weeks[weeks.length - 1];
      if (doesWeekHavePaydayFortnight(firstWeek, payDay) && hasPaydayPastThisWeek(firstWeek, payDay)) {
        weeks.shift();
      }

      return weeks.filter((week) => doesWeekHavePaydayFortnight(week, payDay));
    }

    // @todo other pay intervals
    return weeks;
  }
}

module.exports = TimeUtils;
