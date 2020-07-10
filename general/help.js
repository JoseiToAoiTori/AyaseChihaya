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
				value: 'Returns 10 theme results matching the anime or theme name',
			},
			{
				name: ';theme Ping Pong Tada Hitori',
				value: 'Returns the best match for the combination of anime and theme name.',
			},
			{
				name: ';theme hunter x hunter ed4',
				value: 'Returns 4th ED of closest match for show name or theme name provided. For in-depth usage of this command, refer to this: https://github.com/JoseiToAoiTori/AyaseChihaya/wiki/Theme-Commands-Explanation',
			}],
			footer: {
				text: 'This is a bot developed by Heather ★#6868 (/u/JoseiToAoiTori). Hyakunin Isshu data has been compiled by Shiara#0001 (/u/walking_the_way). Data for AnimeThemes was very poorly scraped from /r/AnimeThemes.',
				icon_url: config.avatar || process.env.AVATAR,
			},
		},
	};
	// Refugee server exclusive commands
	if (message.guildID === '514203145333899276') {
		embed.embed.fields = [...embed.embed.fields,
			{
				name: ';gw',
				value: 'Returns a schedule for groupwatches. Ask Deafness#3061 to update the schedule in case of changes. Ask Heather ★#6868 for code changes or other issues.',
			},
			{
				name: ';ask a question',
				value: 'Command exclusive to bot owner and server admins. Asks a question during family feud games and first to react gets to go first.',
			}];
	}
	message.channel.createMessage(embed);
});
