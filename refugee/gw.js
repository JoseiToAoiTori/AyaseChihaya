const {Command} = require('yuuko');

let config;

try {
	config = require('../config');
} catch (error) {
	config = {};
}

module.exports = new Command('gw', async (message, args, {yuuko}) => {
	if (message.guildID !== '514203145333899276' && message.guildID !== '386933744025468939') return;
	Promise.all([yuuko.getMessage('514249693228826626', '714785577521643537'), yuuko.getMessage('514249693228826626', '714788003624779806')]).then(messages => {
		const regex = /^(.+?): (.*) \((.*)\)/gm;
		const embed = {
			embed: {
				color: config.colour || process.env.COLOUR,
				author: {
					name: 'Groupwatches',
					icon_url: config.avatar || process.env.AVATAR,
					url: 'https://www.thetimezoneconverter.com/',
				},
				thumbnail: {
					url: config.avatar || process.env.AVATAR,
				},
				description: '*Records the UTC timings for all Server Groupwatches. Click title for timezone converter.*',
				footer: {
					text: 'Report any changes to Deafness. For breaking changes or code issues, bug Heather.',
					icon_url: config.avatar || process.env.AVATAR,
				},
				fields: [],
			},
		};
		// eslint-disable-next-line no-undef
		while ((m = regex.exec(messages[0].content)) !== null) {
			// This is necessary to avoid infinite loops with zero-width matches
			// eslint-disable-next-line no-undef
			if (m.index === regex.lastIndex) {
				regex.lastIndex++;
			}
			let watch; let show; let time;
			// The result can be accessed through the `m`-variable.
			// eslint-disable-next-line no-undef
			m.forEach((match, groupIndex) => {
				if (groupIndex === 1) watch = match;
				if (groupIndex === 2) show = match;
				if (groupIndex === 3) time = match;
			});
			embed.embed.fields.push({
				name: watch,
				value: `**${watch}** is currently watching **${show}** at around **${time}**.`,
			});
		}
		embed.embed.fields.push({
			name: '\u200b',
			value: '\u200b',
		});
		embed.embed.fields.push({
			name: 'Movie Watch (Sunday 4:00 AM UTC)',
			value: 'A different movie is decided on and watched every Sunday in <#514249855938330627>.',
		});
		embed.embed.fields.push({
			name: '\u200b',
			value: '\u200b',
		});
		embed.embed.fields.push({
			name: 'Seasonal Watch (1:30 AM UTC usually)',
			value: messages[1].content,
		});
		message.channel.createMessage(embed);
	});
});
