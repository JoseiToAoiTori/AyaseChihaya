const {Command} = require('yuuko');
const ReactionHandler = require('eris-reactions');

let config;

try {
	config = require('../config');
} catch (error) {
	config = {};
}

module.exports = new Command('ask', async (message, args) => {
	const owner = config.owner || process.env.OWNER;
	if (message.author.id !== owner && message.author.id !== '127506802794299393' || args.length < 1) return;
	const question = args.join(' ');
	const qMessage = await message.channel.createMessage(question);
	await qMessage.addReaction('poutthesun:703254550705995888');
	// eslint-disable-next-line new-cap
	const reactionListener = new ReactionHandler.continuousReactionStream(
		qMessage,
		userID => userID !== qMessage.author.id,
		false,
		{maxMatches: 1, time: 20000},
	);
	reactionListener.on('reacted', async event => {
		const reactions = await qMessage.getReaction('poutthesun:703254550705995888');
		const fastest = reactions.find(user => user.id === event.userID);
		message.channel.createMessage(`**${fastest.username}** was the first to react.`);
	});
});
