/* eslint-disable no-await-in-loop */
const {Command} = require('yuuko');
const superagent = require('superagent');

let config;

try {
	config = require('../config');
} catch (error) {
	config = {};
}

const bigQuery = `query ($search: String, $status: [MediaStatus]) {
	Media(type: ANIME, search: $search, sort: SEARCH_MATCH, status_in: $status) {
	  id
	  siteUrl
	  coverImage {
		large
	  }
	  title {
		romaji
	  }
	  nextAiringEpisode {
		episode
		timeUntilAiring
	  }
	}
  }
  `;

module.exports = new Command('next', async (message, args, {yuuko}) => {
	if (args.length < 1) {
		try {
			const embed = {
				embed: {
					title: 'Schedule for Today (Japan Airing)',
					url: 'http://anichart.net',
					color: config.colour || process.env.COLOUR,
					fields: [],
				},
			};
			let data = yuuko.seasonalShows;
			data = data.filter(anime => anime.nextEpisodeAiring - Date.now() > 0 && anime.nextEpisodeAiring - Date.now() < 86400000);
			data.sort((a, b) => a.nextEpisodeAiring - b.nextEpisodeAiring);
			for (const anime of data) {
				let nextEp = new Date(anime.nextEpisodeAiring - Date.now());
				const minutes = Math.floor(nextEp / 1000 / 60 % 60);
				const hours = Math.floor(nextEp / (1000 * 60 * 60) % 24);
				if (hours === 0 && minutes === 0) nextEp = 'Literal seconds away';
				else if (hours === 0) nextEp = `${minutes} minutes`;
				else nextEp = `${hours} hours ${minutes} minutes`;
				embed.embed.fields.push({
					name: `${anime.title.romaji} ${anime.nextAiringEpisode.episode}`,
					value: nextEp,
				});
			}
			message.channel.createMessage(embed);
		} catch (error) {
			console.log(error);
		}
	} else {
		const search = args.join(' ');
		let data;
		try {
			data = await superagent
				.post('https://graphql.anilist.co')
				.send({query: bigQuery, variables: {status: ['RELEASING', 'NOT_YET_RELEASED'], search}})
				.set('accept', 'json');
		} catch (error) {
			message.channel.createMessage(`${error}`);
			return;
		}
		data = data.body.data.Media;
		let nextEp;
		if (data.nextAiringEpisode) {
			nextEp = new Date(data.nextAiringEpisode.timeUntilAiring * 1000);
			const minutes = Math.floor(nextEp / 1000 / 60 % 60);
			const hours = Math.floor(nextEp / (1000 * 60 * 60) % 24);
			const days = Math.floor(nextEp / (1000 * 60 * 60 * 24));
			if (days === 0 && hours === 0 && minutes === 0) nextEp = 'Literal seconds away';
			else if (days === 0 && hours === 0) nextEp = `${minutes} minutes`;
			else if (days === 0) nextEp = `${hours} hours ${minutes} minutes`;
			else nextEp = `${days} days ${hours} hours ${minutes} minutes`;
		} else {
			nextEp = 'Unknown';
		}
		message.channel.createMessage({
			embed: {
				color: config.colour || process.env.COLOUR,
				thumbnail: {
					url: data.coverImage.large,
				},
				title: data.title.romaji,
				url: data.siteUrl,
				fields: [
					{
						name: `Next episode ${data.nextAiringEpisode ? data.nextAiringEpisode.episode || '-' : '?'} in`,
						value: nextEp,
					},
				],
			},
		});
	}
});
