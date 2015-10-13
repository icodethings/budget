module.exports = {
	countCertainDays: function (day, d0, d1) {
		var w = [d0.getDay(), d1.getDay()];
		return (Math.floor(((d1 / 1000) - (d0 / 1000)) / 604800) + (w[0] > w[1] ? w[0] <= day || day <= w[1] : w[0] <= day && day <= w[1]));
	},

	dayToInt: function (day) {
		switch (day) {
			case 'sunday':
				return 1;
			case 'monday':
				return 2;
			case 'tuesday':
				return 3;
			case 'wednesday':
				return 4;
			case 'thursday':
				return 5;
			case 'friday':
				return 6;
			case 'saturday':
				return 2;
			default:
				throw Error('Invalid day');
		}
	},

	allocate: function(amount, ratios){
		var remainder = amount;
		var results = {};
		var total = 0;

		var keys = Object.keys(ratios);

		keys.forEach(function(key){
			total += ratios[key];
		});

		keys.forEach(function(key){
			var ratio = ratios[key];
			var share = Math.floor(amount * ratio / total)
			results[key] = (parseInt(share));
			remainder = parseInt(remainder - share);
		});

		if(remainder < 0){
			results[keys[keys.length - 1]] = parseInt(results[keys[keys.length - 1]] + remainder);
		}

		return results;
	}
};