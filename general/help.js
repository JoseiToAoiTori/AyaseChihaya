const {Command} = require('yuuko');

let config;

try {
	config = require('../config');
} catch (error) {
	config = {};
}

module.exports = new Command('help', message => {
	const embed = {
		embed: {
			thumbnail: {
				url: config.avatar || process.env.AVATAR,
			},
			color: config.colour || process.env.COLOUR,
			author: {
				name: 'Help',
				icon_url: config.avatar || process.env.AVATAR,
			},
			description: 'All commands are used with the `;` prefix.',
			fields: [{
				name: ';anime Sazae-san',
				value: 'Returns info and links for an anime.',
			},
			{
				name: ';manga Taiyou no Ie',
				value: 'Returns info and links for a manga.',
			},
			{
				name: ';user username',
				value: 'Returns info about the AniList user specified.',
			},
			{
				name: ';calendar',
				value: 'Displays all shows airing today in UTC time. Not an indicator of when they\'re available for streaming.',
			},
			{
				name: ';calendar monday',
				value: 'Displays all shows airing on Monday in UTC time. Not an indicator of when they\'re available for streaming.',
			},
			{
				name: ';next',
				value: 'Displays countdowns to all airing anime in the next 24 hours according to AniList API (Japan airtime).',
			},
			{
				name: ';next One Piece',
				value: 'Displays a countdown until the next One Piece episode. Works for any airing.',
			},
			{
				name: ';choose Choice1,Choice2...',
				value: 'Chooses randomly from the specified arguments.',
			},
			{
				name: ';poem naniwa bay',
				value: 'Search Hyakunin Isshu poems by text.',
			},
			{
				name: ';npoem 0',
				value: 'Search Hyakunin Isshu poem by number from 0-100.',
			},
			{
				name: ';themes Nichijou',
				value: 'Returns 15 theme results matching the anime or theme name',
			},
			{
				name: ';theme Ping Pong Tada Hitori',
				value: 'Returns the best match for the combination of anime/theme name.',
			}],
			footer: {
				text: 'This is a bot developed by joseitoaoitori (/u/JoseiToAoiTori). Hyakunin Isshu data has been compiled by shiara (/u/walking_the_way). Data for AnimeThemes was very poorly scraped from /r/AnimeThemes.',
				icon_url: config.avatar || process.env.AVATAR,
			},
		},
	};
	// Refugee server exclusive commands
	if (message.guildID === '514203145333899276') {
		embed.embed.fields = [...embed.embed.fields,
			{
				name: ';ask a question',
				value: 'Command exclusive to bot owner and server admins. Asks a question during family feud games and first to react gets to go first.',
			}];
	}
	message.channel.createMessage(embed);
});
