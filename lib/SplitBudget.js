const BudgetType = require('./BudgetType');

class SplitBudget extends BudgetType {
  get priority() {
    return this.config.priority || 200;
  }

  run(runningBalance) {
    if (runningBalance <= 0) {
      this.addDebugMessage('We have no running balance to use!');

      return this.setValue(0, (this.config.failOnEmpty === false) ? 'warning' : 'failed');
    }

    return this.setValue(runningBalance, 'success');
  }
}

module.exports = SplitBudget;
