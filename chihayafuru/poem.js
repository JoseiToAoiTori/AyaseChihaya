const {Command} = require('yuuko');
const hi = require('../hyakunin-isshu-v2.json');
const Fuse = require('fuse.js');

const options = {
	shouldSort: true,
	threshold: 0.6,
	location: 0,
	distance: 100,
	maxPatternLength: 64,
	minMatchCharLength: 3,
	keys: [
		'poem.original',
		'poem.crunchyroll',
		'poem.romaji',
		'poet',
	],
};

let config;

try {
	config = require('../config');
} catch (error) {
	config = {};
}

function poemFinder(args) {
	const fuse = new Fuse(hi, options);
	const result = fuse.search(args);
	if (result.length) {
		return result[0].item;
	}
	return false;
}

module.exports = new Command('poem', (message, args) => {
	if (args.length < 1) {
		message.channel.createMessage({
			embed: {
				title: 'Please enter search terms.',
				color: config.colour || process.env.COLOUR,
			},
		});
		return;
	}
	const found = poemFinder(args.join(' '));
	if (!found) {
		message.channel.createMessage({
			embed: {
				title: 'Poem not found.',
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
