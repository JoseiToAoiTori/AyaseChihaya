const {Command} = require('yuuko');
const config = require('../config');

module.exports = new Command('send', (message, args, {yuuko}) => {
	if (message.author.id !== config.owner || args.length < 2) return;
	const channelID = args[0];
	args.splice(0, 1);
	try {
		yuuko.createMessage(channelID, {
			embed: {
				description: args.join(' '),
				color: config.colour,
			},
		});
	} catch (error) {
		message.channel.createMessage(error);
	}
});
