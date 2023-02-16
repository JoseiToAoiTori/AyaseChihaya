const {Command} = require('yuuko');
const superagent = require('superagent');

let config;

try {
	config = require('../config');
} catch (error) {
	config = {};
}

function stringifyThemes (videos) {
	let string = '';
	for (let i = 0; i < videos.length; i++) {
		string += `${i + 1}. [${videos[i].filename}](${videos[i].link})\n`;
	}
	return string;
}

module.exports = new Command('themes', async (message, args) => {
	if (args.length < 1 || args.length > 50) {
		message.channel.createMessage({
			embed: {
				title: 'Invalid arguments',
				color: config.colour || process.env.COLOUR,
			},
		});
	} else {
		const qString = encodeURIComponent(args.join(' '));
		const response = await superagent.get(`https://api.animethemes.moe/search?q=${qString}&fields[search]=videos`);
		let videos = response.body.search.videos;
		if (videos.length) {
			if (videos.length > 15) videos = videos.slice(0, 15);
			const embed = {
				embed: {
					title: 'Your Search Results',
					color: config.colour || process.env.COLOUR,
					description: stringifyThemes(videos),
				},
			};
			message.channel.createMessage(embed);
		} else {
			message.channel.createMessage({
				embed: {
					title: 'No results found for your search query.',
					color: config.colour || process.env.COLOUR,
				},
			});
		}
	}
});
