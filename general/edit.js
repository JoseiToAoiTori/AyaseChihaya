const {Command} = require('yuuko');

let config;

try {
	config = require('../config');
} catch (error) {
	config = {};
}

module.exports = new Command('edit', (message, args, {yuuko}) => {
	const owner = config.owner || process.env.OWNER;
	if (message.author.id !== owner || args.length < 2) return;
	const channelID = args[0];
	const messageID = args[1];
	args.splice(0, 2);
	try {
		yuuko.editMessage(channelID, messageID, {
			embed: {
				description: args.join(' '),
				color: config.colour || process.env.COLOUR,
			},
		});
	} catch (error) {
		message.channel.createMessage(error);
	}
});
