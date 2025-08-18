// const {Command} = require('yuuko');
// const superagent = require('superagent');

// let config;

// try {
// 	config = require('../config');
// } catch (error) {
// 	config = {};
// }

// function stringifyThemes (videos) {
// 	let string = '';
// 	for (let i = 0; i < videos.length; i++) {
// 		string += `${i + 1}. [${videos[i].anime.name} ${videos[i].slug} - ${videos[i].song.title}](${videos[i].animethemeentries[0].videos[0].link})\n`;
// 	}
// 	return string;
// }

// module.exports = new Command('themes', async (message, args) => {
// 	if (args.length < 1 || args.length > 50) {
// 		message.channel.createMessage({
// 			embed: {
// 				title: 'Invalid arguments',
// 				color: config.colour || process.env.COLOUR,
// 			},
// 		});
// 	} else {
// 		const qString = encodeURIComponent(args.join(' '));
// 		let response;
// 		try {
// 			response = await superagent.get(`https://api.animethemes.moe/animetheme?q=${qString}&include=anime,song,animethemeentries.videos&page[size]=15`);
// 		} catch (error) {
// 			message.channel.createMessage({
// 				embed: {
// 					title: 'Animethemes fucked up',
// 					color: config.colour || process.env.COLOUR,
// 				},
// 			});
// 			return;
// 		}
// 		let videos = response.body.animethemes;
// 		if (videos.length) {
// 			if (videos.length > 15) videos = videos.slice(0, 15);
// 			const embed = {
// 				embed: {
// 					title: 'Your Search Results',
// 					color: config.colour || process.env.COLOUR,
// 					description: stringifyThemes(videos),
// 				},
// 			};
// 			message.channel.createMessage(embed);
// 		} else {
// 			message.channel.createMessage({
// 				embed: {
// 					title: 'No results found for your search query.',
// 					color: config.colour || process.env.COLOUR,
// 				},
// 			});
// 		}
// 	}
// });

// Deprecated by Ichigo
