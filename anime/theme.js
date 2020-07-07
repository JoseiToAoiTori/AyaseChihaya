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
		'anime',
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

module.exports = new Command('theme', (message, args) => {
	if (args.length < 1 || args.length > 50) {
		message.channel.createMessage({
			embed: {
				title: 'Invalid arguments',
				color: config.colour || process.env.COLOUR,
			},
		});
	} else {
		let filteredThemes;
		let search;
		if (/(?:op|ed)[0-9]+v[0-9]+/.test(args[args.length - 1].toLowerCase())) {
			const opType = args[args.length - 1].substring(0, 2).toUpperCase();
			let opNum = args[args.length - 1].match(/[0-9]+(?:v|V)/)[0];
			opNum = opNum.substring(0, opNum.length - 1);
			// eslint-disable-next-line eqeqeq
			if (opNum == '1') opNum = '';
			let opVer = args[args.length - 1].match(/(?:v|V)[0-9]+/)[0];
			opVer = opVer.substring(1, opVer.length);
			const opFilter = `${opType}${opNum}v${opVer}`;
			filteredThemes = themes.filter(theme => theme.opNum === opFilter);
			if (filteredThemes.length === 0) {
				message.channel.createMessage({
					embed: {
						title: 'Invalid OP/ED type.',
						color: config.colour || process.env.COLOUR,
					},
				});
				return;
			}
			args.splice(args.length - 1, 1);
			search = args.join(' ');
		} else if (/(?:op|ed)v[0-9]+/.test(args[args.length - 1].toLowerCase())) {
			const opType = args[args.length - 1].substring(0, 2).toUpperCase();
			let opVer = args[args.length - 1].match(/(?:v|V)[0-9]+/)[0];
			opVer = opVer.substring(1, opVer.length);
			const opFilter = `${opType}v${opVer}`;
			filteredThemes = themes.filter(theme => theme.opNum === opFilter);
			if (filteredThemes.length === 0) {
				message.channel.createMessage({
					embed: {
						title: 'Invalid OP/ED type.',
						color: config.colour || process.env.COLOUR,
					},
				});
				return;
			}
			args.splice(args.length - 1, 1);
			search = args.join(' ');
		} else if (/^(?:op|ed)[0-9]*$/.test(args[args.length - 1].toLowerCase())) {
			const opType = args[args.length - 1].substring(0, 2).toUpperCase();
			let opNum = '';
			if (args[args.length - 1].length > 2) {
				opNum = args[args.length - 1].match(/[0-9]+/);
				// eslint-disable-next-line eqeqeq
				if (opNum == '1') opNum = '';
			}
			const opFilter = `${opType}${opNum}`;
			filteredThemes = themes.filter(theme => theme.opNum.includes(opFilter) || theme.opNum === opFilter);
			if (filteredThemes.length === 0) {
				message.channel.createMessage({
					embed: {
						title: 'Invalid OP/ED type.',
						color: config.colour || process.env.COLOUR,
					},
				});
				return;
			}
			args.splice(args.length - 1, 1);
			search = args.join(' ');
		} else {
			filteredThemes = themes;
			search = args.join(' ');
		}

		const fuse = new Fuse(filteredThemes, options);
		let result = fuse.search(search);
		if (result.length) {
			result = result[0].item;
			message.channel.createMessage(`${result.anime.romaji} ${result.opNum} ${result.opName}
${result.link}`);
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
