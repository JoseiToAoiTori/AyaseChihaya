const {Client} = require('yuuko');
const path = require('path');

const Chance = require('chance');
const chance = new Chance();
const ReactionHandler = require('eris-reactions');

const rrConfig = require('./reactRoles.json');

let config;

try {
	config = require('./config');
} catch (error) {
	config = {};
}

const yuuko = new Client({
	token: config.token || process.env.TOKEN, // Token used to auth your bot account
	prefix: config.prefix || process.env.PREFIX, // Prefix used to trigger commands
	ignoreBots: true,
});

yuuko
	.extendContext({yuuko})
	.addCommandDir(path.join(__dirname, 'general'))
	.addCommandDir(path.join(__dirname, 'anime'))
	.addCommandDir(path.join(__dirname, 'chihayafuru'))
	.addCommandDir(path.join(__dirname, 'refugee'))
	.connect();

yuuko.once('ready', async () => {
	console.log('Successfully connected to Discord.');
	if (rrConfig.channelID && rrConfig.messageID && rrConfig.guildID) {
		const msg = await yuuko.getMessage(rrConfig.channelID, rrConfig.messageID);
		for (const react of rrConfig.reactRoles) {
			if (!msg.reactions[react.emote]) {
				// eslint-disable-next-line no-await-in-loop
				await msg.addReaction(react.emote);
				console.log('emote created');
			}
		}
		// eslint-disable-next-line new-cap
		const reactionListener = new ReactionHandler.continuousReactionStream(
			msg,
			userID => userID !== msg.author.id,
			true,
		);
		console.log('Listening for reactions');
		reactionListener.on('reacted', async event => {
			const msgAgain = await yuuko.getMessage(rrConfig.channelID, rrConfig.messageID);
			const reactRole = rrConfig.reactRoles.find(rr => rr.emote === `${event.emoji.name}:${event.emoji.id}` || rr.emote === event.emoji.name);
			const memberRoles = msgAgain.channel.guild.members.get(event.userID).roles;
			const found = memberRoles.find(role => role === reactRole.roleID);
			if (found) {
				await yuuko.removeGuildMemberRole(rrConfig.guildID, event.userID, reactRole.roleID, 'react role through Chihaya');
				const dmChannel = await yuuko.getDMChannel(event.userID);
				dmChannel.createMessage(`You no longer have access to the <#${reactRole.channel}> channel.`);
			} else {
				await yuuko.addGuildMemberRole(rrConfig.guildID, event.userID, reactRole.roleID, 'react role through Chihaya');
				const dmChannel = await yuuko.getDMChannel(event.userID);
				dmChannel.createMessage(`You now have access to the <#${reactRole.channel}> channel. To revoke access, simply react again.`);
			}
		});
	}
});

yuuko.editStatus('online', {
	name: ';help for list of commands',
	type: 0,
	url: 'https://github.com/JoseiToAoiTori/AyaseChihaya',
});

yuuko.on('messageCreate', message => {
	if (message.content.toLowerCase().includes('top 10 reasons') && (message.guildID === '514203145333899276' || message.guildID === '386933744025468939') && !message.author.bot) {
		message.channel.createMessage(`1. You can help people out
2. You can have a lot of fun with everyone
3. You'll end up with a great smile
4. You'll be good at sports
5. The uniforms are cute
6. Cute yet cool
7. Cute!
8. Amazing!
9. Beautiful!!
10. Yay!!!`);
	}
	if (message.content.toLowerCase().includes('antifa') && chance.bool({likelihood: 25})) {
		message.channel.createMessage('T E R R O R I S T  O R G A N I Z A T I O N');
	}
});
