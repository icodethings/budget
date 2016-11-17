const BudgetType = require('./BudgetType');

class TimedBudget extends BudgetType {
  get priority() {
    return this.config.priority || 100;
  }

  run(runningBalance) {
    if (runningBalance <= 0) {
      this.addDebugMessage('We have no running balance to use!');

      return this.setValue(0, 'failed');
    }

    if (new Date() < this.config.start) {
      this.addDebugMessage('Start date hasn\'t been passed yet. Skipping.');

      return this.setValue(0, 'warning');
    }

    if (new Date() > this.config.end) {
      this.addDebugMessage('End date has been passed. Skipping.');

      return this.setValue(0, 'warning');
    }

    const paydays = this.budget.getPaydaysBetweenDates(this.config.start, this.config.end);

    if (paydays <= 0) {
      this.addDebugMessage('There are no paydays between the start date and the end date');

      return this.setValue(0, 'warning');
    }

    this.addDebugMessage(`There is ${paydays} payday(s) between the start date and the end date`);

    const paydaysSince = this.budget.getPaydaysBetweenDates(this.config.start, new Date(), { excludeFirstWeek: true });
    this.addDebugMessage(`There has been ${paydaysSince} payday(s) since now and the start date`);

    const paydaysUntil = this.budget.getPaydaysBetweenDates(new Date(), this.config.end);
    this.addDebugMessage(`There are ${paydaysUntil} payday(s) between now and the end date`);

    let desired = parseInt(this.config.desiredBalance);
    this.addDebugMessage(`We want to get to the desired balance: ${desired}`);

    let usePaydays = paydays;

    if (typeof this.config.currentBalance !== 'undefined') {
      const currentBalance = parseInt(this.config.currentBalance);
      desired = Math.max(0, desired -= currentBalance);

      this.addDebugMessage(`Because the current balance of: ${currentBalance} is provided, we will reduce the desired to: ${desired}`);

      usePaydays = paydaysUntil;

      this.addDebugMessage(`Because we know the current balance, we'll divide the desired: ${desired} by the reaminging weeks: ${usePaydays}`)
    } else {
      this.addDebugMessage(`Because we don't know the current balance, we will just divide the current desired: ${desired} by the total paydays between start and end: ${usePaydays}`)
    }

    if (desired <= 0) {
      this.addDebugMessage('Desired is 0');

      return this.setValue(0, 'success');
    }

    const perWeek = Math.ceil(desired / usePaydays);

    this.addDebugMessage(`Per week value of: ${perWeek}`);

    if (perWeek > runningBalance) {
      this.addDebugMessage('We don\'t have the running balance to complete this budget. We\'ll use the remaining of your running balance');

      return this.setValue(runningBalance, 'warning');
    }

    return this.setValue(perWeek, 'success');
  }
}

module.exports = TimedBudget;
