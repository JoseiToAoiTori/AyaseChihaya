const {Client} = require('yuuko');
const path = require('path');

let config;

try {
	config = require('./config');
} catch (error) {
	config = {};
}

const yuuko = new Client({
	token: config.token || process.env.TOKEN,  // Token used to auth your bot account
	prefix: config.prefix || process.env.PREFIX,              // Prefix used to trigger commands
});

yuuko
	.extendContext({yuuko})
	.addCommandDir(path.join(__dirname, 'general'))
	.addCommandDir(path.join(__dirname, 'anime'))
	.addCommandDir(path.join(__dirname, 'chihayafuru'))
	.connect();

yuuko.once('ready', () => {
	console.log('Successfully connected to Discord.');
});
