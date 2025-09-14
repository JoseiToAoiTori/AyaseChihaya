const {Command} = require('yuuko');
const Chance = require('chance');

let config;

try {
	config = require('../config');
} catch (error) {
	config = {};
}

module.exports = new Command('choose', (message, args) => {
	const chance = new Chance();
	const choices = args.join(' ').split(',');
	if (choices.length < 2) {
		message.channel.createMessage({
			embed: {
				title: 'Not enough arguments.',
				color: config.colour || process.env.COLOUR,
			},
		});
		return;
	}
	message.channel.createMessage(`${chance.pickone(choices)}`);
});
