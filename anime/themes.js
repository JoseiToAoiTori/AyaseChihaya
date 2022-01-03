const {Command} = require('yuuko');
const themes = require('../theme-data.json');
const Fuse = require('fuse.js');

const options = {
	shouldSort: true,
	threshold: 0.6,
	location: 0,
	distance: 100,
	maxPatternLength: 64,
	minMatchCharLength: 3,
	keys: [
		'opName',
		'anime.romaji',
		'anime.english',
		'anime.native',
		'anime.userPreferred',
		'synonyms',
		'opNum',
	],
};

let config;

try {
	config = require('../config');
} catch (error) {
	config = {};
}

function stringifyThemes (themeArr) {
	let string = '';
	for (let i = 0; i < themeArr.length; i++) {
		string += `${i + 1}. [${themeArr[i].item.anime.romaji} ${themeArr[i].item.opNum} - ${themeArr[i].item.opName}](${themeArr[i].item.link})\n`;
	}
	return string;
}

module.exports = new Command('themes', (message, args) => {
	//if (args.length < 1 || args.length > 50) {
	//	message.channel.createMessage({
	//		embed: {
	//			title: 'Invalid arguments',
	//			color: config.colour || process.env.COLOUR,
	//		},
	//	});
	//} else {
	//	const search = args.join(' ');
	//	try {
	//		const fuse = new Fuse(themes, options);
	//		let result = fuse.search(search);
	//		if (result.length) {
	//			if (result.length > 15) result = result.slice(0, 15);
	//			const embed = {
	//				embed: {
	//					title: 'Your Search Results',
	//					color: config.colour || process.env.COLOUR,
	//					description: stringifyThemes(result),
	//				},
	//			};
	//			message.channel.createMessage(embed);
	//		} else {
	//			message.channel.createMessage({
	//				embed: {
	//					title: 'No results found for your search query.',
	//					color: config.colour || process.env.COLOUR,
	//				},
	//			});
	//		}
	//	} catch (error) {
	//		message.channel.createMessage({
	//			embed: {
	//				title: 'Invalid query',
	//				color: config.colour || process.env.COLOUR,
	//			},
	//		});
	//	}
	//}
});
