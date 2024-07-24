const {Command} = require('yuuko');

let config;

try {
	config = require('../config');
} catch (error) {
	config = {};
}

module.exports = new Command('calendar', (message, args, {yuuko}) => {
	let data = yuuko.seasonalShows;
	for (const show of data) {
		show.day = new Date(show.nextEpisodeAiring).getDay();
	}

	let enDay;
	const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

	if (args.length < 1) {
		enDay = days[new Date(Date.now()).getDay()];
	} else {
		enDay = args.join(' ').toLowerCase();
	}
	const nDay = days.findIndex(aDay => aDay === enDay);
	if (nDay === -1) {
		message.channel.createMessage({
			embed: {
				title: "That's not a day of the week.",
				color: config.colour || process.env.COLOUR,
			},
		});
	} else {
		data = data.filter(show => show.day === nDay);
		data.sort((a, b) => {
			const aDate = new Date(a.nextEpisodeAiring);
			aDate.setMonth(1);
			aDate.setFullYear(1999);
			aDate.setDate(1);
			const bDate = new Date(b.nextEpisodeAiring);
			bDate.setMonth(1);
			bDate.setFullYear(1999);
			bDate.setDate(1);
			return aDate - bDate;
		});
		enDay = enDay.charAt(0).toUpperCase() + enDay.slice(1);
		const embed = {
			embed: {
				title: `Schedule for ${enDay} (UTC+0)`,
				url: 'http://anichart.net',
				color: config.colour || process.env.COLOUR,
				fields: [],
			},
		};
		for (const anime of data) {
			const date = new Date(anime.nextEpisodeAiring);
			let minutes;
			if (date.getMinutes() === 0) {
				minutes = '00';
			} else if (date.getMinutes() < 10) {
				minutes = `0${date.getMinutes()}`;
			} else {
				minutes = date.getMinutes().toString();
			}
			embed.embed.fields.push({
				name: `${anime.title.romaji}`,
				value: `${date.getHours() > 9 ? date.getHours() : `0${date.getHours().toString()}`}:${minutes}`,
			});
		}
		message.channel.createMessage(embed);
	}
});
