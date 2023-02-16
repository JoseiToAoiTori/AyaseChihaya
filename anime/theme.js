const {Command} = require('yuuko');
const superagent = require('superagent');

let config;

try {
	config = require('../config');
} catch (error) {
	config = {};
}

module.exports = new Command('theme', async (message, args) => {
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
		const videos = response.body.search.videos;
		if (videos.length) {
			message.channel.createMessage(`${videos[0].link}`);
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
