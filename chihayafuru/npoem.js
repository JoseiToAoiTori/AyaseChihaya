const {Command} = require('yuuko');
const hi = require('../hyakunin-isshu-v2.json');

let config;

try {
	config = require('../config');
} catch (error) {
	config = {};
}

function poemFinder(args) {
	const found = hi.find(({id}) => id == args);
	if (!found) return;
	return found;
}

module.exports = new Command('npoem', (message, args) => {
	if (args.length < 1) {
		message.channel.createMessage({
			embed: {
				title: 'Please enter a poem number.',
				color: config.colour || process.env.COLOUR,
			},
		});
		return;
	}
	const found = poemFinder(args[0]);
	if (!found) {
		message.channel.createMessage({
			embed: {
				title: 'Invalid poem number.',
				color: config.colour || process.env.COLOUR,
			},
		});
	} else {
		let embed = {
			embed: {
				color: config.colour || process.env.COLOUR,
				thumbnail: {
					url: config.avatar || process.env.AVATAR,
				},
				author: {
					name: `Poem # ${found.id}`,
					icon_url: 'https://www.japan21.org/wp-content/uploads/hpb-media/img/100karuta.jpg',
					url: 'https://www.reddit.com/r/chihayafuru/wiki/hyakunin-isshu',
				},
				footer: {
					text: 'Raw data for poems prepared by Shiara#0001 (/u/walking_the_way).',
					icon_url: 'https://cdn.discordapp.com/avatars/114301794624077825/a_8c30ca22f921e1f990936fef3a2d412c.gif',
				},
				fields: [
					{
						name: 'Poet',
						value: found.poet,
					},
					{
						name: 'Original',
						value: found.poem.original,
					},
					{
						name: 'Romaji',
						value: found.poem.romaji,
					},
					{
						name: 'Crunchyroll Translation',
						value: found.poem.crunchyroll,
					},
					{
						name: 'Subreddit Wiki',
						value: 'You can find more reputable translations of the poems on the [subreddit wiki](https://www.reddit.com/r/chihayafuru/wiki/hyakunin-isshu).',
					},
				],
			},
		};
		message.channel.createMessage(embed);
	}
});
