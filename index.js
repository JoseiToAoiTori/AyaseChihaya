/* eslint-disable no-await-in-loop */
const {Client} = require('yuuko');
const path = require('path');

const Chance = require('chance');
const chance = new Chance();
const ReactionHandler = require('eris-reactions');

const rrConfig = require('./reactRoles.json');
// const rrConfig2 = require('./reactRoles2.json');

const nextCache = require('./next-cache');

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
	.addDir(path.join(__dirname, 'general'))
	.addDir(path.join(__dirname, 'anime'))
	.addDir(path.join(__dirname, 'chihayafuru'))
	.addDir(path.join(__dirname, 'refugee'))
	.connect();

yuuko.once('ready', async () => {
	console.log('Successfully connected to Discord.');
	if (rrConfig.channelID && rrConfig.messageID && rrConfig.guildID) {
		const msg = await yuuko.getMessage(rrConfig.channelID, rrConfig.messageID);
		for (const react of rrConfig.reactRoles) {
			if (!msg.reactions[react.emote]) {
				// eslint-disable-next-line no-await-in-loop
				console.log(react.emote);
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
			const reactRole = rrConfig.reactRoles.find(rr => rr.emote === `${event.emoji.name}:${event.emoji.id}` || rr.emote === event.emoji.name);
			const memberRoles = event.msg.channel.guild.members.get(event.userID).roles;
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
	//
	// if (rrConfig2.channelID && rrConfig2.messageID && rrConfig2.guildID) {
	// const msg = await yuuko.getMessage(rrConfig2.channelID, rrConfig2.messageID);
	// for (const react of rrConfig2.reactRoles) {
	// if (!msg.reactions[react.emote]) {
	// // eslint-disable-next-line no-await-in-loop
	// await msg.addReaction(react.emote);
	// console.log('emote created');
	// }
	// }
	// // eslint-disable-next-line new-cap
	// const reactionListener2 = new ReactionHandler.continuousReactionStream(
	// msg,
	// userID => userID !== msg.author.id,
	// true,
	// );
	// console.log('Listening for reactions');
	// reactionListener2.on('reacted', async event => {
	// const reactRole = rrConfig2.reactRoles.find(rr => rr.emote === `${event.emoji.name}:${event.emoji.id}` || rr.emote === event.emoji.name);
	// const memberRoles = event.msg.channel.guild.members.get(event.userID).roles;
	// const found = memberRoles.find(role => role === reactRole.roleID);
	// if (found) {
	// await yuuko.removeGuildMemberRole(rrConfig2.guildID, event.userID, reactRole.roleID, 'react role through Chihaya');
	// const dmChannel = await yuuko.getDMChannel(event.userID);
	// dmChannel.createMessage(`You no longer have access to the <#${reactRole.channel}> channel.`);
	// } else {
	// await yuuko.addGuildMemberRole(rrConfig2.guildID, event.userID, reactRole.roleID, 'react role through Chihaya');
	// const dmChannel = await yuuko.getDMChannel(event.userID);
	// dmChannel.createMessage(`You now have access to the <#${reactRole.channel}> channel. To revoke access, simply react again.`);
	// }
	// });
	// }
	//

	// Yo fix this copypaste bullshit later
	let data;
	try {
		data = await nextCache.getSeasonalShows();
		for (const show of data) {
			show.nextEpisodeAiring = Date.now() + show.nextAiringEpisode.timeUntilAiring * 1000;
		}
		yuuko.seasonalShows = data;
		console.log('Seasonals loaded');
	} catch (error) {
		console.log(error);
	}
	setInterval(async () => {
		try {
			data = await nextCache.getSeasonalShows();
			for (const show of data) {
				show.nextEpisodeAiring = Date.now() + show.nextAiringEpisode.timeUntilAiring * 1000;
			}
			yuuko.seasonalShows = data;
			console.log('Seasonals loaded');
		} catch (error) {
			console.log(error);
		}
	}, 1800 * 1000);

	setInterval(async () => {
		const message = await yuuko.getMessage(rrConfig.touchingGrassChannelID, rrConfig.touchingGrassMessageID);
		const splitData = message.content.split('=');
		if (splitData.length <= 1) {
			return;
		}
		const allGrassTouchers = splitData[1].split('|');
		const stillTouchingGrass = [];
		const grassTouched = [];

		for (const grassToucher of allGrassTouchers) {
			if (grassToucher.length <= 0) continue;
			const id = grassToucher.split(':')[0];
			const timestamp = grassToucher.split(':')[1];
			if (parseInt(timestamp, 10) < new Date().getTime()) {
				grassTouched.push(id);
				try {
					await yuuko.removeGuildMemberRole(rrConfig.guildID, id, rrConfig.touchingGrassRoleID);
					await yuuko.createMessage('514220178511233024', `<@${id}> has stopped touching grass.`);
				} catch (error) {
					console.log('rip');
				}
			} else {
				if (grassTouched.find(el => el === id)) continue;
				stillTouchingGrass.push(grassToucher);
			}
		}
		let newString = `${splitData[0]}=${stillTouchingGrass.join('|')}`;
		if (stillTouchingGrass.length > 0) newString = `${newString}|`;
		await yuuko.editMessage(rrConfig.touchingGrassChannelID, rrConfig.touchingGrassMessageID, newString);
	}, 60 * 1000); // 60 * 1000 milsec
});

yuuko.editStatus('online', {
	name: ';help for list of commands',
	type: 0,
	url: 'https://github.com/JoseiToAoiTori/AyaseChihaya',
});

yuuko.on('messageCreate', async message => {
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

	if (message.content.toLowerCase() === 'who' && message.channel.id === '1071699552035409980' && message.author.id === '542254615329112065') {
		message.channel.createMessage('<@542254615329112065> https://kpop.fandom.com/\n\nLook them up you lazy bum');
	}

	if (/https:\/\/twitter|https:\/\/x\.com/.test(message.content) && /\/status\//.test(message.content) && !message.author.bot) {
		let content = message.content.replaceAll(/https:\/\/twitter\.com/g, 'https://girlcockx.com');
		content = content.replaceAll(/https:\/\/x\.com/g, 'https://girlcockx.com');
		content = content.replaceAll(/(https:\/\/girlcockx\.com\/[^\s?]+)(?:\?.*?)?(\/en)?(?=\s|$)/g, '$1/en');
		try {
			await message.channel.createMessage(`${content}\n\n\n- Sent by ${message.author.username}`);
			await message.delete();
		} catch (error) {
			console.log('Screw you aztec');
		}
	} else if (/https:\/\/vxtwitter|https:\/\/fixvx|https:\/\/girlcockx|https:\/\/fxtwitter\.com/.test(message.content) && /\/status\//.test(message.content) && !message.author.bot) {
		const containsJapanese = /[\u3040-\u30FF\u4E00-\u9FFF]/;
		setTimeout(async () => {
			const embedsContainJapanese = message.embeds.some(embed => containsJapanese.test(embed.description || ''));
			if (embedsContainJapanese) {
				let content = message.content.replace(/(https:\/\/(?:girlcockx|vxtwitter|fixvx|fxtwitter)\.com\/[^\s?]+)(?:\?.*?)?(\/en)?(?=\s|$)/g, '$1/en');
				if (!content.includes('/en/en')) {
					content = content.replace(/https:\/\/(vxtwitter|fixvx)\.com/g, 'https://girlcockx.com');
					try {
						await message.channel.createMessage(`${content}\n\n\n- Sent by ${message.author.username}`);
						await message.delete();
					} catch (error) {
						console.log('Screw you aztec');
					}
				}
			}
		}, 2000);
	}
});

const vxRegex = new RegExp(/https:\/\/girlcockx|fxtwitter\.com/g);

// Allow people to delete girlcockx messages if they are the author
yuuko.on('messageReactionAdd', async (message, emote, reactor) => {
	const msg = await yuuko.getMessage(message.channel.id, message.id);
	if (msg.author.id === yuuko.user.id && emote.name === '✂️' && msg.content.includes(reactor.username) && vxRegex.test(msg.content)) {
		setTimeout(async () => {
			await msg.delete();
		}, 2000);
	}
});
