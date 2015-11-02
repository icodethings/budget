var utils = require('./lib/utils.js');

function Budget() {
	this.config = null;
	this.amount = 0;
	this.cleanBudgets = {
		ensure: [],
		timed: [],
		fixed: [],
		split: []
	};

	this.output = {
		remainder: 0,
		budgets: []
	};
}

Budget.prototype = {
	run: function (config) {
		this.config = config;
		this.amount = parseInt(this.config.amount);

		this.config.budgets.forEach(this.cleanBudget.bind(this));

		// Run the Ensure budgets
		this.runEnsure.call(this);

		// Run the Timed budgets
		this.runTimed.call(this);

		// Run the Fixed budgets
		this.runFixed.call(this);

		// Run the Split budgets
		this.runSplit.call(this);

		return this.output;
	},

	cleanBudget: function (budget) {
		this.cleanBudgets[budget.type].push(budget);
	},

	runEnsure: function () {
		if (this.cleanBudgets.ensure.length == 0) {
			return false;
		}

		this.cleanBudgets.ensure.forEach(function (budget) {
			budget.amount = parseInt(budget.amount);
			budget.currentValue = parseInt(budget.currentValue);

			if (!budget.currentValue && budget.currentValue !== 0) {
				throw Error('No amount passed to ensure budget ' + budget.name);
			}

			if (budget.currentValue > budget.amount) {
				// Is there more in the account than we want?

				if (!budget.allowNegative) {
					return false;
				}

				var over = parseInt(budget.currentValue - budget.amount);

				this.amount = parseInt(this.amount + over);

				return this.output.budgets.push({
					type: 'ensure',
					name: budget.name,
					amount: parseInt(-1 * over),
					comments: 'Over budget'
				});
			} else if ((budget.currentValue + this.amount) >= budget.amount) {
				// Is there enough to cover this budget?

				var diff = parseInt(budget.amount - budget.currentValue);

				this.amount = parseInt(this.amount - diff);

				return this.output.budgets.push({
					type: 'ensure',
					name: budget.name,
					amount: parseInt(diff),
					comments: 'Normal ensure budget'
				});
			} else {
				// Not enough to cover the budget, let's just give us as much as possible
				var left = parseInt(this.amount);

				this.amount = parseInt(0);

				return this.output.budgets.push({
					type: 'ensure',
					name: budget.name,
					amount: left,
					comments: 'No more money budget!'
				});
			}
		}.bind(this));

		return true;
	},

	runTimed: function(){
		if (this.cleanBudgets.timed.length == 0) {
			return false;
		}

		this.cleanBudgets.timed.forEach(function (budget) {
			budget.amount = parseInt(budget.amount);
			budget.currentValue = parseInt(budget.currentValue);

			if(budget.useCurrentValue === true){
				budget.amount = parseInt(budget.amount - budget.currentValue);
			}

			// No more is needed!
			if(budget.amount <= 0){
				return false;
			}

			var daysSince = utils.countCertainDays(utils.dayToInt(this.config.runDay), new Date(), budget.start);
			var daysTill = utils.countCertainDays(utils.dayToInt(this.config.runDay), new Date(), budget.end);

			if(daysSince > 0 || daysTill < 0){
				// Skipping because it's not in the time period
				return false;
			}

			// If we aren't using the current value we have to spread is accross the entire time period
			var perWeek = 0;

			if(budget.useCurrentValue === false){
				var totalDays = (-1 * daysSince) + daysTill;

				perWeek = Math.ceil(budget.amount / totalDays);
			}else{
				perWeek = Math.ceil(budget.amount / daysTill);
			}

			if(perWeek <= this.amount){
				this.amount = parseInt(this.amount - parseInt(perWeek));

				return this.output.budgets.push({
					type: 'timed',
					name: budget.name,
					amount: parseInt(perWeek),
					daysTill: daysTill,
					comments: 'Normal timed budget'
				});
			}

			return false;
		}.bind(this));

		return true;
	},

	runFixed: function(){
		if (this.cleanBudgets.fixed.length == 0) {
			return false;
		}

		this.cleanBudgets.fixed.forEach(function (budget) {
			budget.amount = parseInt(budget.amount);

			if(budget.amount <= this.amount){
				this.amount = parseInt(this.amount - budget.amount);

				return this.output.budgets.push({
					type: 'fixed',
					name: budget.name,
					amount: parseInt(budget.amount),
					comments: 'Normal fixed budget'
				});
			}

			return false;
		}.bind(this));

		return true;
	},

	runSplit: function(){
		var ratios = {};

		this.cleanBudgets.split.forEach(function (budget) {
			ratios[budget.name] = budget.amount;
		}.bind(this));

		var split = utils.allocate(this.amount, ratios);

		Object.keys(split).forEach(function(name){
			var amount = parseInt(split[name]);

			this.amount = parseInt(this.amount - amount);

			return this.output.budgets.push({
				type: 'split',
				name: name,
				amount: parseInt(amount),
				comments: 'Percentage split'
			});
		}.bind(this));

		return true;
	},
};

module.exports = Budget;