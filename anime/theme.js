// const {Command} = require('yuuko');
// const superagent = require('superagent');

// let config;

// try {
// 	config = require('../config');
// } catch (error) {
// 	config = {};
// }

// module.exports = new Command('theme', async (message, args) => {
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
// 			response = await superagent.get(`https://api.animethemes.moe/animetheme?q=${qString}&include=animethemeentries.videos&page[size]=1`);
// 		} catch (error) {
// 			message.channel.createMessage({
// 				embed: {
// 					title: 'Animethemes fucked up',
// 					color: config.colour || process.env.COLOUR,
// 				},
// 			});
// 			return;
// 		}
// 		const videos = response.body.animethemes;
// 		if (videos.length && videos[0].animethemeentries.length && videos[0].animethemeentries[0].videos.length) {
// 			message.channel.createMessage(`${videos[0].animethemeentries[0].videos[0].link}`);
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
