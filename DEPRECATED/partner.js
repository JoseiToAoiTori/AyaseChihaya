const {Command} = require('yuuko');

let config;

try {
	config = require('../config');
} catch (error) {
	config = {};
}
// ;partner ServerName imgLink discordLink Message
module.exports = new Command('partner', (message, args) => {
	const owner = config.owner || process.env.OWNER;
	if (message.author.id !== owner) return;
	const header = args[0];
	const img = args[1];
	const link = args[2];
	args.splice(0, 3);
	const messageToSend = args.join(' ');
	try {
		message.channel.createMessage({
			embed: {
				thumbnail: {
					url: img,
				},
				author: {
					name: header,
					icon_url: img,
					url: link,
				},
				color: config.colour || process.env.COLOUR,
				fields: [
					{
						name: link,
						value: messageToSend,
					},
				],
			},
		});
	} catch (error) {
		message.channel.createMessage(error);
	}
});
