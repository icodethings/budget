const TimeUtils = require('./TimeUtils');

const defaultConfig = {
  payDay: {
    weekDay: 'monday',
  },
  payInterval: 'week',
};

class Budget {
  constructor(balance, config) {
    this.balance = parseInt(balance);
    this.config = Object.assign({}, defaultConfig, config);
    this.budgets = [];
  }

  setBalance(balance) {
    this.balance = balance;

    return this;
  }

  addBudget(budget) {
    budget.budget = this;

    this.budgets.push(budget);

    return this;
  }

  getBudgetsOfType(type) {
    return this.budgets.filter((budget) => budget instanceof type);
  }

  getBudgets() {
    return this.budgets;
  }

  getRunningBalance() {
    return this.budgets.reduce((running, budget) => {
      if (budget.ran === true) {
        return running - budget.value;
      }

      return running;
    }, this.balance);
  }

  getBudgetValue() {
    return this.budgets.reduce((running, budget) => {
      if (budget.ran === true) {
        return running + budget.value;
      }

      return running;
    }, 0);
  }

  getPaydaysBetweenDates(start, end, opts) {
    const { excludeFirstWeek } = opts || {};

    let weeks = TimeUtils.getArrayOfWeeks(start, end);

    if (excludeFirstWeek === true) {
      weeks.shift();
    }

    return TimeUtils.getPaydayWeeks(this.config.payInterval, this.config.payDay, weeks).length;
  }

  run() {
    this.budgets.sort((a, b) => a.priority - b.priority);

    this.budgets.forEach((budget) => {
      const runningBalance = this.getRunningBalance();

      budget.run(runningBalance);
    });

    return true;
  }
}

module.exports = Budget;
