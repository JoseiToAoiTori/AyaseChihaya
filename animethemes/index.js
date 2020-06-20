const Snoowrap = require('snoowrap');
const pages = require('./pages.json');
const fs = require('fs');

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

function getThemes (anime, page, mal) {
	let tableContent = page.split(anime);
	tableContent.splice(0, 1);
	tableContent = tableContent.join(anime);
	while (!tableContent.startsWith('](')) {
		tableContent = tableContent.split(anime);
		tableContent.splice(0, 1);
		tableContent = tableContent.join(anime);
	}
	tableContent = tableContent.split('-|:-:|:-:|:-:|:-:|:-:')[1];
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
		json.push({
			anime,
			mal,
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

Promise.all(getPageContent).then(pageContent => {
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
	// eslint-disable-next-line no-sync
	fs.writeFile('theme-data.json', JSON.stringify(json), 'utf-8', error => {
		if (error) console.log(error);
		console.log('Successfully scraped themes');
	});
});
