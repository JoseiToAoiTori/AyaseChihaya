const {Command} = require('yuuko');
const superagent = require('superagent');
const distinctColors = require('distinct-colors').default

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
		const colours = distinctColors({count: users.size});
		const dataset = [];
		let index = 0;
		for (const user of users) {
			const data = {
				label: user,
				borderColor: colours[index].css(),
				fill: false,
				data: [],
			};
			index++;
			const userMessages = messages.filter(message => message.author.username === user && message.content.split(' ').length > 2).sort((a, b) => a.timestamp - b.timestamp);
			if (userMessages.length === 0) continue;
			let startTime = userMessages[0].timestamp; // Start time for plotting
			while (startTime <= userMessages[userMessages.length - 1].timestamp) {
				const wordCount = userMessages.filter(message => message.timestamp > startTime && message.timestamp < startTime + 86400000).reduce((accumulator, message) => accumulator + message.content.split(' ').length, 0);
				if (wordCount > 50) {
					data.data.push({
						x: new Date(startTime),
						y: wordCount,
					});
				}
				startTime += 86400000;
			}
			dataset.push(data);
		}
		const chart = {
			type: 'line',
			data: {datasets: dataset},
			options: {
				scales: {
					xAxes: [{
						type: 'time',
						time: {
							unit: 'day',
						},
					}],
				},
			},
		};
		let response;
		try {
			response = await superagent
				.post('https://quickchart.io/chart/create')
				.send({
					backgroundColor: 'transparent',
					width: 1500,
					height: 900,
					format: 'png',
					chart,
				});
			msg.delete();
			incomingMessage.channel.createMessage({
				embed: {
					title: `Chart Generated At: ${response.body.url}`,
					color: config.colour || process.env.COLOUR,
				},
			});
		} catch (error) {
			msg.delete();
			incomingMessage.channel.createMessage({
				embed: {
					title: 'Something went wrong.',
					color: config.colour || process.env.COLOUR,
				},
			});
		}
	} else {
		incomingMessage.channel.createMessage({
			embed: {
				title: "You can't do that.",
				color: config.colour || process.env.COLOUR,
			},
		});
	}
});
