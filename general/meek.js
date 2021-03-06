const {Command} = require('yuuko');
const Meeks = require('../node_modules/meeks-prf-js/run/meek');
const superagent = require('superagent');

let config;

try {
	config = require('../config');
} catch (error) {
	config = {};
}

module.exports = new Command('meek', async (message, args) => {
	if (!args.length) {
		message.channel.createMessage({
			embed: {
				title: 'Error',
				description: 'No arguments.',
				color: config.colour || process.env.COLOUR,
			},
		});
		return;
	}
	let seats;
	try {
		seats = parseInt(args[0], 10);
	} catch (error) {
		message.channel.createMessage({
			embed: {
				title: 'Error',
				description: 'Invalid number of seats.',
				color: config.colour || process.env.COLOUR,
			},
		});
		return;
	}
	if (message.attachments[0]) {
		const file = await superagent.get(message.attachments[0].url);
		let ballots = file.text.split('\n');
		let candidates = [];
		for (const ballot of ballots) {
			candidates = [...candidates, ...ballot.split('|')];
		}
		candidates = [...new Set(candidates)];
		ballots = ballots.map(ballot => [1, ballot.split('|')]);
		try {
			const results = [...Meeks.tabulate(
				seats, candidates, ballots,
				100, [], '', '', {}, null,
			).elected];

			let messageToSend = '';

			for (let i = 0; i < results.length; i++) {
				messageToSend += `${results[i]}\n`;
			}

			message.channel.createMessage({
				embed: {
					title: 'All Winners',
					description: messageToSend,
					color: config.colour || process.env.COLOUR,
				},
			});
		} catch (error) {
			if (error.message.includes('Tied candidate')) {
				message.channel.createMessage({
					embed: {
						title: 'Error',
						description: 'There was a tie.',
						color: config.colour || process.env.COLOUR,
					},
				});
			} else {
				message.channel.createMessage({
					embed: {
						title: 'Error',
						description: 'You messed up the ballot.',
						color: config.colour || process.env.COLOUR,
					},
				});
			}
		}
	} else {
		let ballots = args.splice(1, args.length);
		ballots = ballots.join(' ').split('%');
		let candidates = [];
		for (const ballot of ballots) {
			candidates = [...candidates, ...ballot.split('|')];
		}
		candidates = [...new Set(candidates)];
		ballots = ballots.map(ballot => [1, ballot.split('|')]);
		try {
			const results = [...Meeks.tabulate(
				seats, candidates, ballots,
				100, [], '', '', {}, null,
			).elected];

			let messageToSend = '';

			for (let i = 0; i < results.length; i++) {
				messageToSend += `${results[i]}\n`;
			}

			message.channel.createMessage({
				embed: {
					title: 'All Winners',
					description: messageToSend,
					color: config.colour || process.env.COLOUR,
				},
			});
		} catch (error) {
			if (error.message.includes('Tied candidate')) {
				message.channel.createMessage({
					embed: {
						title: 'Error',
						description: 'There was a tie.',
						color: config.colour || process.env.COLOUR,
					},
				});
			} else {
				message.channel.createMessage({
					embed: {
						title: 'Error',
						description: 'You messed up the ballot.',
						color: config.colour || process.env.COLOUR,
					},
				});
			}
		}
	}
});
