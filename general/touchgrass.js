const {Command} = require('yuuko');
const rrConfig = require('../reactRoles.json');

let config;

try {
	config = require('../config');
} catch (error) {
	config = {};
}

module.exports = new Command('touchgrass', async (message, args, {yuuko}) => {
	if (message.guildID !== rrConfig.guildID) return;
	if (args.length < 1) {
		message.channel.createMessage({
			embed: {
				title: 'Specify a period of hours to touch grass for.',
				color: config.colour || process.env.COLOUR,
			},
		});
		return;
	}
	message.member.addRole(rrConfig.touchingGrassRoleID);
	const infoMessage = await yuuko.getMessage(rrConfig.touchingGrassChannelID, rrConfig.touchingGrassMessageID);
	const timeout = new Date().getTime() + args[0] * 60 * 60 * 1000;
	await yuuko.editMessage(rrConfig.touchingGrassChannelID, rrConfig.touchingGrassMessageID, `${infoMessage.content}${message.member.user.id}:${timeout}|`);
	message.channel.createMessage(`${message.author.username} has chosen to touch grass!`);
});
