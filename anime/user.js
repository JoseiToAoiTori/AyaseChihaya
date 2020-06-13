const {Command} = require('yuuko');
const superagent = require('superagent');

let config;

try {
	config = require('../config');
} catch (error) {
	config = {};
}

const query = `query ($name: String) {
	User(search: $name) {
	  id
	  name
	  siteUrl
	  avatar {
		large
		medium
	  }
	  statistics {
		anime {
		  count
		  meanScore
		}
		manga {
		  count
		  meanScore
		}
	  }
	  favourites(page: 1) {
		anime(page: 1, perPage: 5) {
		  nodes {
			id
			title {
			  romaji
			}
			siteUrl
		  }
		}
		manga(page: 1, perPage: 5) {
		  nodes {
			id
			title {
			  romaji
			}
			siteUrl
		  }
		}
		characters(page: 1, perPage: 5) {
		  nodes {
			id
			name {
			  full
			}
			siteUrl
			media(sort: [POPULARITY_DESC], perPage: 1, page: 1) {
			  nodes {
				id
				title {
				  romaji
				}
			  }
			}
		  }
		}
		staff(page: 1, perPage: 5) {
		  nodes {
			id
			siteUrl
			name {
			  full
			}
		  }
		}
	  }
	}
  }
  `;

function getAnimeFavourites (data) {
	let anime = '';
	data.forEach(item => {
		anime += `[${item.title.romaji}](${item.siteUrl})`;
		anime += '\n';
	});
	return anime;
}

function getMangaFavourites (data) {
	let manga = '';
	data.forEach(item => {
		manga += `[${item.title.romaji}](${item.siteUrl})`;
		manga += '\n';
	});
	return manga;
}

function getCharFavourites (data) {
	let char = '';
	data.forEach(item => {
		char += `[${item.name.full}](${item.siteUrl})` + ' ';
		char += `(${item.media.nodes[0].title.romaji})`;
		char += '\n';
	});
	return char;
}

function getStaffFavourites (data) {
	let staff = '';
	data.forEach(item => {
		staff += `[${item.name.full}](${item.siteUrl})`;
		staff += '\n';
	});
	return staff;
}

module.exports = new Command('user', async (message, args) => {
	if (args.length < 1) {
		message.channel.createMessage({
			embed: {
				title: 'Please enter more search terms.',
				color: config.colour || process.env.COLOUR,
			},
		});
		return;
	}
	const name = args.join(' ');
	let response;
	try {
		response = await superagent
			.post('https://graphql.anilist.co')
			.send({query, variables: {name}})
			.set('accept', 'json');
	} catch (error) {
		message.channel.createMessage(`${error}`);
		return;
	}
	response = response.body.data.User;
	let embed = {
		embed: {
			color: config.colour || process.env.COLOUR,
			author: {
				name: response.name,
				icon_url: response.avatar.large,
				url: response.siteUrl,
			},
			thumbnail: {
				url: response.avatar.large,
			},
			fields: [
				{
					name: 'Total Anime',
					value: response.statistics.anime.count,
					inline: true,
				},
			],
		},
	};
	if (response.statistics.anime.meanScore) {
		embed.embed.fields.push({
			name: 'Mean Score (Anime)',
			value: `${response.statistics.anime.meanScore}`,
		});
	}
	embed.embed.fields.push({
		name: 'Total Manga',
		value: response.statistics.manga.count,
	});
	if (response.statistics.manga.meanScore) {
		embed.embed.fields.push({
			name: 'Mean Score (Manga)',
			value: `${response.statistics.manga.meanScore}`,
		});
	}
	const animeFavourites = getAnimeFavourites(response.favourites.anime.nodes);
	const mangaFavourites = getMangaFavourites(response.favourites.manga.nodes);
	const charFavourites = getCharFavourites(response.favourites.characters.nodes);
	const staffFavourites = getStaffFavourites(response.favourites.staff.nodes);
	if (animeFavourites) {
		embed.embed.fields.push({
			name: 'Favourite Anime',
			value: animeFavourites,
		});
	}
	if (mangaFavourites) {
		embed.embed.fields.push({
			name: 'Favourite Manga',
			value: mangaFavourites,
		});
	}
	if (charFavourites) {
		embed.embed.fields.push({
			name: 'Favourite Characters',
			value: charFavourites,
		});
	}
	if (staffFavourites) {
		embed.embed.fields.push({
			name: 'Favourite Staff',
			value: staffFavourites,
		});
	}

	message.channel.createMessage(embed);
});
