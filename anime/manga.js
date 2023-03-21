const {Command} = require('yuuko');
const superagent = require('superagent');
const TurndownService = require('turndown');

const turndownService = new TurndownService();

let config;

try {
	config = require('../config');
} catch (error) {
	config = {};
}

const query = `query ($search: String) {
	results: Media(type: MANGA, sort: SEARCH_MATCH, search: $search) {
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
	  chapters
	  format
	  genres
	  idMal
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

module.exports = new Command('manga', async (message, args) => {
	if (args.length < 1) {
		message.channel.createMessage({
			embed: {
				title: 'Please enter more search terms.',
				color: config.colour || process.env.COLOUR,
			},
		});
		return;
	}
	const search = args.join(' ');
	let response;
	try {
		response = await superagent
			.post('https://graphql.anilist.co')
			.send({query, variables: {search}})
			.set('accept', 'json');
	} catch (error) {
		message.channel.createMessage(`${error}`);
		return;
	}
	const anime = response.body.data.results;
	const rank = anime.rankings.find(ranking => ranking.context === 'most popular all time');

	const embed = {
		embed: {
			color: config.colour  || process.env.COLOUR,
			title: anime.title.romaji,
			thumbnail: {
				url: anime.coverImage.large,
			},
			description: `[AniList](${anime.siteUrl}) | [MyAnimeList](https://myanimelist.net/manga/${anime.idMal})`,
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
					name: 'Chapters',
					value: anime.chapters || 'Unknown',
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
				{
					name: 'Description',
					value: anime.description ? anime.description.length >= 1020 ? turndownService.turndown(anime.description.substring(0, 1020)) + '...' : turndownService.turndown(anime.description) : '*No description provided*',
				},
			],
		},
	};
	message.channel.createMessage(embed);
});
