const {Command} = require('yuuko');
const shortUrl = require("node-url-shortener");

let config;

try {
	config = require('../config');
} catch (error) {
	config = {};
}

module.exports = new Command('activity', async (incomingMessage, args, {yuuko}) => {
	const owner = config.owner || process.env.OWNER;
	if (args.length > 0 && incomingMessage.author.id === owner) {
		const channel = await yuuko.getChannel(args[0]);
		const msg = await incomingMessage.channel.createMessage({
			embed: {
				title: 'Generating chart',
				color: config.colour || process.env.COLOUR,
			},
		});
		const messages = await channel.getMessages(20000);
		console.log('Messages acquired');
		const users = new Set(messages.map(message => message.author.username));
		const dataset = [{
			data: [],
		}];
		const labels = [];
		for (const user of users) {
			const userMessages = messages.filter(message => message.author.username === user);
			if (userMessages.length === 0) continue;
			labels.push(user);
			dataset[0].data.push(userMessages.length);
		}
		const chart = {
			type: 'pie',
			data: {datasets: dataset, labels},
		};
		let url = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chart))}`;
		console.log(JSON.stringify(chart));
		shortUrl.short(url, function (err, url) {
			msg.delete();
			incomingMessage.channel.createMessage({
				embed: {
					title: `Chart Generated At: ${url}`,
					color: config.colour || process.env.COLOUR,
				},
			});
		});
	} else {
		incomingMessage.channel.createMessage({
			embed: {
				title: "You can't do that.",
				color: config.colour || process.env.COLOUR,
			},
		});
	}
});
