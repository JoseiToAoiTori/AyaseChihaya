const {Command} = require('yuuko');

let config;

try {
	config = require('../config');
} catch (error) {
	config = {};
}

module.exports = new Command('countdown', async (message, args) => {
    var timeRemaining = 5;
    while (timeRemaining >= 1) {
        await message.channel.createMessage(`${timeRemaining}`);
        timeRemaining = timeRemaining - 1;
        await new Promise(r => setTimeout(r, 800));
    }
});
