const {Command} = require('yuuko');
const config = require('../config');
const Chance = require('chance');

module.exports = new Command('choose', (message, args) => {
	const chance = new Chance();
	const choices = args.join(' ').split(',');
	if (choices.length < 2) {
		message.channel.createMessage({
			embed: {
				title: 'Not enough arguments.',
				color: config.colour,
			},
		});
		return;
	}
	message.channel.createMessage(`${chance.pickone(choices)}`);
});
