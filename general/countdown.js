const {Command} = require('yuuko');

let config;

try {
	config = require('../config');
} catch (error) {
	config = {};
}

module.exports = new Command('countdown', (message, args) => {
    var timeRemaining = 5;
    setInterval(async () => {
        while (timeRemaining >= 1) {
            message.channel.createMessage(`${timeRemaining}`);
            timeRemaining = timeRemaining - 1;
        }
    }, 900)
});
