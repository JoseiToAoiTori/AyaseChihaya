const {Command} = require('yuuko');
const config = require('../config.json');

module.exports = new Command('help', message => {
	const embed = {
		embed: {
			thumbnail: {
				url: config.avatar,
			},
			color: 8302335,
			author: {
				name: 'Help',
				icon_url: config.avatar,
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
			],
			footer: {
				text: 'This is a bot developed by Heather ★#6868 (/u/EpicTroll27). Hyakunin Isshu data has been compiled by Shiara#0001 (/u/walking_the_way).',
				icon_url: config.avatar,
			},
		},
	};
	// Refugee server exclusive commands
	if (message.guildID === '514203145333899276') {
		embed.embed.fields = [...embed.embed.fields, {
			name: ';gw',
			value: 'Returns a schedule for groupwatches. Ask Heather ★#6868 to update the schedule in case of changes.',
		},
		{
			name: ';ask a question',
			value: 'Command exclusive to Heather and Ralon. Asks a question during family feud games and first to react gets to go first.',
		}
		];
	}
	message.channel.createMessage(embed);
});
