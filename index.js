const {Client} = require('yuuko');
const config = require('./config');
const path = require('path');

const yuuko = new Client({
	token: config.token,  // Token used to auth your bot account
	prefix: config.prefix,              // Prefix used to trigger commands
});

yuuko
	.addCommandDir(path.join(__dirname, 'general'))
	.connect();

yuuko.once('ready', () => {
	console.log('Successfully connected to Discord.');
});
