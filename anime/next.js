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

const singleQuery = `query ($page: Int) {
	Page(page: $page, perPage: 50) {
	  pageInfo {
		perPage
		currentPage
		lastPage
		hasNextPage
	  }
	  media(type: ANIME, countryOfOrigin: JP, status: RELEASING, sort: [POPULARITY_DESC], isAdult: false, format_in: [TV, TV_SHORT, MOVIE]) {
		title {
		  romaji
		}
		nextAiringEpisode {
		  episode
		  timeUntilAiring
		}
	  }
	}
  }
  `;
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

module.exports = new Command('next', async (message, args) => {
	if (args.length < 1) {
		let page = 1;
		const promiseArr = [];
		let data;
		try {
			data = await superagent
				.post('https://graphql.anilist.co')
				.send({query: singleQuery, variables: {page}})
				.set('accept', 'json');
		} catch (error) {
			message.channel.createMessage(`${error}`);
			return;
		}
		const lastPage = data.body.data.Page.pageInfo.lastPage;
		console.log(singleQuery);
		console.log(JSON.stringify(data.body));
		data = data.body.data.Page.media;
		page++;
		console.log(page);
		while (page <= lastPage) {
			promiseArr.push(superagent
				.post('https://graphql.anilist.co')
				.send({query: singleQuery, variables: {page}})
				.set('accept', 'json'));
			page++;
		}
		console.log(promiseArr.length);
		Promise.all(promiseArr).then(returnedData => {
			for (const anime of returnedData) {
				data = [...data, ...anime.body.data.Page.media];
			}
			const embed = {
				embed: {
					title: 'Schedule for Today (Japan Airing)',
					url: 'http://anichart.net',
					color: config.colour || process.env.COLOUR,
					fields: [],
				},
			};
			for (const anime of data) {
				if (anime.nextAiringEpisode) console.log(anime);
			}
			data = data.filter(anime => anime.nextAiringEpisode && anime.nextAiringEpisode.timeUntilAiring && anime.nextAiringEpisode.timeUntilAiring < 86400);
			data.sort((a, b) => a.nextAiringEpisode.timeUntilAiring - b.nextAiringEpisode.timeUntilAiring);
			for (const anime of data) {
				let nextEp = new Date(anime.nextAiringEpisode.timeUntilAiring * 1000);
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
		});
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
