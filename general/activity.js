const {Command} = require('yuuko');
const superagent = require('superagent');
const iwanthue = require('iwanthue');

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
		const palette = iwanthue(users.size)
		const dataset = [{
			data: [],
			backgroundColor: palette
		}];
		const labels = [];
		for (const user of users) {
			const userMessages = messages.filter(message => message.author.username === user);
			if (userMessages.length === 0) continue;
			labels.push(user);
			dataset[0].data.push(userMessages.length);
		}
		dataset[0].data.sort((a, b) => a - b);
		const chart = {
			type: 'outlabeledPie',
			data: {datasets: dataset, labels},
			"options": {
				"plugins": {
				  "legend": false,
				  "outlabels": {
					"text": "%l %p",
					"color": "white",
					"stretch": 30,
					"font": {
					  "resizable": true,
					  "minSize": 12,
					  "maxSize": 18
					}
				  }
				}
			}
		};
		let url = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chart))}`;
		console.log(JSON.stringify(chart));
		url = await superagent.get(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`);
		msg.delete();
		incomingMessage.channel.createMessage({
			embed: {
				title: `Chart generated at: ${url.text}`,
				color: config.colour || process.env.COLOUR,
			},
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
