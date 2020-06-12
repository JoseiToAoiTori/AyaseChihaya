const {Command} = require('yuuko');
const config = require('../config');
const superagent = require('superagent');
const TurndownService = require('turndown');

const turndownService = new TurndownService();

const query = `query ($search: String) {
	results: Media(type: ANIME, sort: SEARCH_MATCH, search: $search) {
	  id
	  format
	  startDate {
		year
	  }
	  title {
		romaji
	  }
	  coverImage {
		large
	  }
	  siteUrl
	  averageScore
	  description
	  duration
	  episodes
	  format
	  genres
	  idMal
	  nextAiringEpisode {
		id
		episode
		timeUntilAiring
	  }
	  popularity
	  rankings {
		id
		context
		rank
	  }
	  source
	  status
	  startDate {
		year
		month
		day
	  }
	  endDate {
		year
		month
		day
	  }
	}
  }
  `;

module.exports = new Command('anime', async (message, args) => {
	if (args.length < 1) {
		message.channel.createMessage({
			embed: {
				title: 'Please enter more search terms.',
				color: config.colour,
			},
		});
		return;
	}
	const search = args.join(' ');
	const response = await superagent
		.post('https://graphql.anilist.co')
		.send({query, variables: {search}})
		.set('accept', 'json');
	const anime = response.body.data.results;
	const rank = anime.rankings.find(ranking => ranking.context === 'most popular all time');
	let nextEp;
	if (anime.nextAiringEpisode) {
		nextEp = new Date(anime.nextAiringEpisode.timeUntilAiring * 1000);
		const minutes = Math.floor((nextEp/1000/60) % 60);
		const hours = Math.floor((nextEp/(1000*60*60)) % 24);
		const days = Math.floor(nextEp/(1000*60*60*24));
		nextEp = `${days} days ${hours} hours ${minutes} minutes`;
	}

	const embed = {
		embed: {
			color: config.colour,
			title: anime.title.romaji,
			thumbnail: {
				url: anime.coverImage.large,
			},
			description: `[AniList](${anime.siteUrl}) | [MyAnimeList](https://myanimelist.net/anime/${anime.idMal})`,
			fields: [
				{
					name: 'Average score',
					value: `${anime.averageScore || '-'}%`,
					inline: true,
				},
				{
					name: 'Ranking',
					value: rank ? `#${rank.rank}` : 'Unknown',
					inline: true,
				},
				{
					name: 'Format',
					value: anime.format || 'Unknown',
					inline: true,
				},
				{
					name: 'Source',
					value: anime.source || 'Unknown',
					inline: true,
				},
				{
					name: 'Episodes',
					value: anime.episodes || 'Unknown',
					inline: true,
				},
				{
					name: 'Status',
					value: anime.status || 'Unknown',
					inline: true,
				},
				{
					name: 'Start Date',
					value: anime.startDate.month ? `${anime.startDate.day}/${anime.startDate.month}/${anime.startDate.year}` : 'Unknown',
					inline: true,
				},
				{
					name: 'End Date',
					value: anime.endDate.month ? `${anime.endDate.day}/${anime.endDate.month}/${anime.endDate.year}` : 'Unknown',
					inline: true,
				},
				{
					name: 'Genres',
					value: anime.genres.join('\n'),
					inline: true,
				},
			],
		},
	};
	if (nextEp) {
		embed.embed.fields.push({
			name: 'Next Episode',
			value: nextEp,
		});
	}
	embed.embed.fields.push({
		name: 'Description',
		value: anime.description ? anime.description.length >= 1020? turndownService.turndown(anime.description.substring(0, 1020)) + '...' : turndownService.turndown(anime.description) : '*No description provided*',
	});
	message.channel.createMessage(embed);
});
