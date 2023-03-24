const {Command} = require('yuuko');

let config;

try {
	config = require('../config');
} catch (error) {
	config = {};
}

module.exports = new Command('send', (message, args, {yuuko}) => {
	const owner = config.owner || process.env.OWNER;
	if (message.author.id !== owner || args.length < 2) return;
	const channelID = args[0];
	args.splice(0, 1);
	try {
		yuuko.createMessage(channelID, {
			embed: {
				description: args.join(' '),
				color: config.colour || process.env.COLOUR,
			},
		});
	} catch (error) {
		message.channel.createMessage(error);
	}
});
