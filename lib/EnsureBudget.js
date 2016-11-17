const BudgetType = require('./BudgetType');

class EnsureBudget extends BudgetType {
  get priority() {
    return this.config.priority || 50;
  }

  run(runningBalance) {
    const desiredBalance = parseInt(this.config.desiredBalance);
    const currentBalance = parseInt(this.config.currentBalance);

    // Current balance is higher than the desired
    if (currentBalance > desiredBalance) {
      if (this.config.allowNegative !== true) {
        this.addDebugMessage('Current balance is higher than desired but the allowNegative config variable isn\'t true, so we\'ll skip this budget');

        return this.setValue(0, 'success');
      }

      this.addDebugMessage('Current balance is higher than desired and the allowNegative config variable is set to true, so we\'ll take money out of your account');

      const over = parseInt(currentBalance - desiredBalance);

      this.addDebugMessage(`You are over by: ${over}`);

      return this.setValue(-1 * over, 'success');
    }

    if(runningBalance <= 0){
      this.addDebugMessage('We have no running balance to use!');

      return this.setValue(0, 'failed');
    }

    const difference = parseInt(desiredBalance - currentBalance);

    this.addDebugMessage(`We need to make up a difference of: ${difference}`);

    // Check we don't have the money
    if (difference > runningBalance) {
      this.addDebugMessage('We don\'t have the running balance to complete this budget. We\'ll use the remaining of your running balance');

      return this.setValue(runningBalance, 'warning');
    }

    return this.setValue(difference, 'success');
  }
}

module.exports = EnsureBudget;
