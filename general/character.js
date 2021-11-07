const {Command} = require('yuuko');
const superagent = require('superagent');

let config;

try {
	config = require('../config');
} catch (error) {
	config = {};
}

module.exports = new Command('character', async (message, args) => {
	// if (args.length < 3) {
	//	message.channel.createMessage({
	//		embed: {
	//			title: 'Please specify a character and server name in the format ;character <FIRSTNAME> <LASTNAME> <SERVER>.',
	//			color: config.colour || process.env.COLOUR,
	//		},
	//	});
	//	return;
	// }
	// let response;
	// try {
	//	response = await superagent.get(`https://xiv-api-chihaya.herokuapp.com/characters/name/${args[2]}/${args[0]}%20${args[1]}.png`);
	// } catch (error) {
	//	response = null;
	// }
	// if (response && response.ok && Buffer.isBuffer(response.body)) {
	//	console.log(response.body);
	//	message.channel.createMessage('Praise Yoshi-P', {file: response.body, name: `${args[0]}_${args[1]}.png`});
	// } else {
	//	message.channel.createMessage({
	//		embed: {
	//			title: 'Help Yoshi-P is banging on my door, yelling at me to buy the new mogstation mount!!!!!',
	//			color: config.colour || process.env.COLOUR,
	//		},
	//	});
	// }
});
