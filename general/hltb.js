const {Command} = require('yuuko');
const hltb = require('howlongtobeat');
const hltbService = new hltb.HowLongToBeatService();

let config;

try {
	config = require('../config');
} catch (error) {
	config = {};
}

module.exports = new Command('hltb', async (message, args) => {
	if (args.length < 1) {
		message.channel.createMessage({
			embed: {
				title: 'Please specify a game.',
				color: config.colour || process.env.COLOUR,
			},
		});
		return;
	}
	const query = args.join(' ');
	let response = await hltbService.search(query);
	response = response[0];
	const embed = {
		embed: {
			color: config.colour || process.env.COLOUR,
			author: {
				name: response.name,
				icon_url: `https://howlongtobeat.com${response.imageUrl}`,
				url: `https://howlongtobeat.com/game?id=${response.id}`,
			},
			thumbnail: {
				url: `https://howlongtobeat.com${response.imageUrl}`,
			},
			fields: [
				{
					name: 'Main Story',
					value: `${response.gameplayMain} hours`,
					inline: true,
				},
				{
					name: 'Main + Extras',
					value: `${response.gameplayMainExtra} hours`,
					inline: true,
				},
				{
					name: 'Completionist',
					value: `${response.gameplayCompletionist} hours`,
					inline: true,
				},
			],
		},
	};
	message.channel.createMessage(embed);
});
