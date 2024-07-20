/* eslint-disable no-await-in-loop */
const superagent = require('superagent');

const singleQuery = `query ($startdateGreater: FuzzyDateInt, $startdateLesser: FuzzyDateInt, $page: Int) {
    Page(page: $page) {
      pageInfo {
        hasNextPage
      }
      media(startDate_greater: $startdateGreater, startDate_lesser: $startdateLesser, type: ANIME, sort: TITLE_ROMAJI) {
        title {
          romaji
        }
        nextAiringEpisode {
          id
          episode
          timeUntilAiring
        }
      }
    }
  }`;

async function getSeasonalShows () {
	let page = 1;
	let data;
	let hasNextPage = true;
	//
	// WINTER
	// Months December to February
	//
	// SPRING
	// Months March to May
	//
	// SUMMER
	// Months June to August
	//
	// FALL
	// Months September to November
	//
	const startdateGreater = 20240301;
	const startdateLesser = 20240830;
	try {
		data = await superagent
			.post('https://graphql.anilist.co')
			.send({query: singleQuery, variables: {page, startdateGreater, startdateLesser}})
			.set('accept', 'json');
	} catch (error) {
		console.log(error);
		return;
	}
	data = data.body.data.Page.media;
	page++;
	while (hasNextPage) {
		const response = await superagent
			.post('https://graphql.anilist.co')
			.send({query: singleQuery, variables: {page, startdateGreater, startdateLesser}})
			.set('accept', 'json');
		data = [...data, ...response.body.data.Page.media];
		hasNextPage = response.body.data.Page.pageInfo.hasNextPage;
		page++;
	}
	data = data.filter(anime => anime.nextAiringEpisode && anime.nextAiringEpisode.timeUntilAiring);
	return data;
}

exports.getSeasonalShows = getSeasonalShows;
