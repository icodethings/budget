class BudgetType {
  constructor(config) {
    this.config = config;
    this._ran = false;
    this._value = 0;
    this._debug = [];
    this._status = 'pending';
    this._budget = null;
  }

  get value() {
    if (this._ran === false) {
      return false;
    }

    return this._value;
  }

  get ran() {
    return this._ran;
  }

  get status() {
    return this._status;
  }

  set budget(budget) {
    this._budget = budget;

    return this;
  }

  get budget(){
    return this._budget;
  }

  addDebugMessage(message) {
    this._debug.push(message);
  }

  setValue(value, status) {
    this._value = parseInt(value);
    this._ran = true;
    this._status = status;
    return true;
  }
}

module.exports = BudgetType;
