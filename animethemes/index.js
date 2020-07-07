const Snoowrap = require('snoowrap');
const pages = require('./pages.json');
const fs = require('fs');
const superagent = require('superagent');

const getPageContent = [];

const json = [];

let config;

try {
	config = require('./config.json');
} catch (error) {
	config = {};
}

const r = new Snoowrap({
	userAgent: config.userAgent || process.env.USERAGENT,
	clientId: config.clientId || process.env.CLIENT_ID,
	clientSecret: config.clientSecret || process.env.CLIENT_SECRET,
	username: config.username || process.env.USERNAME,
	password: config.password || process.env.PASSWORD,
});

const showQuerySimple = `query ($id: [Int], $page: Int, $perPage: Int) {
	Page(page: $page, perPage: $perPage) {
	  pageInfo {
		total
		currentPage
		lastPage
	  }
	  results: media(type: ANIME, idMal_in: $id) {
		id
		idMal
		format
		startDate {
		  year
		}
		title {
		  romaji
		  english
		  native
		  userPreferred
		}
		coverImage {
		  large
		  extraLarge
		}
		siteUrl
	  }
	}
  }
  `;

async function paginatedQuery (query, idArr, page) {
	try {
		const response = await superagent
			.post('https://graphql.anilist.co')
			.send({
				query,
				variables: {
					id: idArr,
					page,
					perPage: 50,
				},
			})
			.set('accept', 'json');
		const data = response.body;
		return data;
	} catch (error) {
		console.log(error);
	}
}

function getThemes (anime, page, mal) {
	let tableContent = page.split(anime);
	tableContent.splice(0, 1);
	tableContent = tableContent.join(anime);
	while (!tableContent.startsWith('](')) {
		tableContent = tableContent.split(anime);
		tableContent.splice(0, 1);
		tableContent = tableContent.join(anime);
	}
	tableContent = tableContent.split(/-\|:-:\|:-:\|:-:\|:-:\|:-:|-\|:-:\|:-:\|:-:/)[1];
	tableContent = tableContent.split(/\r?\n\r?\n\r?/gm)[0];
	const themes = tableContent.split(/\r?\n/);
	if (themes[0].length === 0) themes.splice(0, 1);
	for (const theme of themes) {
		const splitData = theme.split('|');
		if (!splitData[0]) continue;
		const opData = splitData[0].split(' ');
		let opNum;
		let opName;
		if (/V[0-9]+/g.test(opData[1])) {
			opNum = `${opData[0]}${opData[1].toLowerCase()}`;
			opData.splice(0, 2);
			opName = opData.join(' ');
		} else {
			opNum = opData[0];
			opData.splice(0, 1);
			opName = opData.join(' ');
		}
		let link = splitData[1].match(/https:\/\/.*\)/gm);
		if (!link) continue;
		link = link[0].substring(0, link[0].length - 1);
		let malID;
		if (mal.includes('myanimelist')) {
			malID = mal.match(/\/[0-9]+/gm)[0];
			malID = parseInt(malID.substring(1, malID.length), 10);
		}
		opName = opName.replace(/"/g, '');
		json.push({
			anime,
			malID,
			link,
			opNum,
			opName,
		});
	}
}

// Execution begins here
for (const page of pages) {
	getPageContent.push(r.getSubreddit('animethemes').getWikiPage(page).content_md);
}

Promise.all(getPageContent).then(async pageContent => {
	for (const page of pageContent) {
		const regex = /###\[(.*)\]\((.*)\)/gm;
		let m;
		while ((m = regex.exec(page)) !== null) {
			let anime;
			let mal;
			// This is necessary to avoid infinite loops with zero-width matches
			if (m.index === regex.lastIndex) {
				regex.lastIndex++;
			}

			// The result can be accessed through the `m`-variable.
			m.forEach((match, groupIndex) => {
				if (groupIndex === 1) anime = match;
				else if (groupIndex === 2) mal = match;
			});

			getThemes(anime, page, mal);
		}
	}
	let IDs = json.map(entry => entry.malID);
	IDs = [...new Set(IDs)];
	const promiseArray = [];
	let showData = [];
	let pageNum = 1;
	const someData = await paginatedQuery(showQuerySimple, IDs, pageNum);
	showData = [...showData, ...someData.data.Page.results];
	const lastPage = someData.data.Page.pageInfo.lastPage;
	pageNum = 2;
	while (pageNum <= lastPage) {
		promiseArray.push(new Promise(async (resolve, reject) => {
			try {
				const returnData = await paginatedQuery(showQuerySimple, IDs, pageNum);
				resolve(returnData.data.Page.results);
			} catch (error) {
				reject(error);
			}
		}));
		pageNum++;
	}
	Promise.all(promiseArray).then(finalData => {
		for (const data of finalData) {
			showData = [...showData, ...data];
		}
		for (const theme of json) {
			const found = showData.find(show => show.idMal === theme.malID);
			if (found) {
				theme.anime = found.title;
			}
			delete theme.malID;
		}
		// eslint-disable-next-line no-sync
		fs.writeFile('theme-data.json', JSON.stringify(json), 'utf-8', error => {
			if (error) console.log(error);
			console.log('Successfully scraped themes');
		});
	});
});
