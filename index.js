const {Client} = require('yuuko');
const path = require('path');

const Chance = require('chance');
const chance = new Chance();

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
	.addCommandDir(path.join(__dirname, 'refugee'))
	.connect();

yuuko.once('ready', () => {
	console.log('Successfully connected to Discord.');
});

yuuko.on('messageCreate', message => {
	if (message.content.toLowerCase().includes('top 10 reasons') && (message.guildID === '514203145333899276' || message.guildID === '386933744025468939')) {
		message.channel.createMessage(`1. You can help people out
2. You can have a lot of fun with everyone
3. You'll end up with a great smile
4. You'll be good at sports
5. The uniforms are cute
6. Cute yet cool
7. Cute!
8. Amazing!
9. Beautiful!!
10. Yay!!!`);
	}
	if (message.content.toLowerCase().includes('antifa') && chance.bool({likelihood: 60})) {
		message.channel.createMessage('T E R R O R I S T  O R G A N I Z A T I O N');
	}
});
