# budget-js
A JS library that splits up your money into different budgets every week.

## Example

```
var BudgetJS = require('budget-js');

var budget = new BudgetJS();

var config = {
	runDay: 'tuesday',
	dryRun: false,
	amount: 106600,
	budgets: [
		{
			name: 'Spending',
			type: 'ensure',
			amount: 8000,
			currentValue: 4393,
			allowNegative: true
		},
		{
			name: 'Mortgage',
			type: 'timed',
			start: new Date(2015, 9, 17),
			end: new Date(2015, 11, 17),
			amount: 230000,
			currentValue: 183432,
			useCurrentValue: true
		},
		{
			name: 'Emergency',
			type: 'fixed',
			amount: 10000
		},
		{
			name: 'Savings',
			type: 'split',
			amount: 40
		},
		{
			name: 'Reno Savings',
			type: 'split',
			amount: 60
		}
	]
};

var output = budget.run(config);

console.log(output);
```

### Output

```
{
  "remainder": 0,
  "budgets": [
    {
      "type": "ensure",
      "name": "Spending",
      "amount": 3607,
      "comments": "Normal ensure budget"
    },
    {
      "type": "timed",
      "name": "Mortgage",
      "amount": 4657,
      "daysTill": 10,
      "comments": "Normal timed budget"
    },
    {
      "type": "fixed",
      "name": "Emergency",
      "amount": 10000,
      "comments": "Normal fixed budget"
    },
    {
      "type": "split",
      "name": "Savings",
      "amount": 35334,
      "comments": "Percentage split"
    },
    {
      "type": "split",
      "name": "Reno Savings",
      "amount": 53001,
      "comments": "Percentage split"
    }
  ]
}
```

## Execution Order

 - Ensure
 - Timed
 - Fixed
 - Split