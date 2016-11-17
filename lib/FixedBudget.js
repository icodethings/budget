const BudgetType = require('./BudgetType');

class FixedBudget extends BudgetType {
  get priority() {
    return this.config.priority || 150;
  }

  run(runningBalance) {
    if (runningBalance <= 0) {
      this.addDebugMessage('We have no running balance to use!');

      return this.setValue(0, 'failed');
    }

    const amount = parseInt(this.config.amount);

    if (amount > runningBalance) {
      this.addDebugMessage('We don\'t have the running balance to complete this budget. We\'ll use the remaining of your running balance');

      return this.setValue(runningBalance, 'warning');
    }

    return this.setValue(amount, 'success');
  }
}

module.exports = FixedBudget;
