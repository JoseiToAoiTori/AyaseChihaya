# Ayase Chihaya

[![](https://david-dm.org/JoseiToAoiTori/AyaseChihaya/status.svg)](https://david-dm.org/JoseiToAoiTori/AyaseChihaya) ![](https://badgen.net/npm/node/next)

***

A Discord Bot for personal use. Any functionality is entirely arbitrary and dependent on my mood. Built on top of the Yuuko and Eris frameworks.

***

## Usage

Requires NodeJS and yarn. npm will also work. You also need like, a Discord Bot account and stuff.

```bash
# Edit your configs
$ cp sample.config.js config.js && $EDITOR config.js
$ cp animethemes/sample.config.js animethemes/config.js && $EDITOR animethemes/config.js
# Install dependencies
$ yarn
# Start the bot
$ node index
```

## Environment Variables

I made this bot environment variable friendly so I could deploy it on Heroku. Here they are:

- `TOKEN` - Discord Bot Token
- `OWNER` - User ID of bot owner. Should be whoever is deploying the bot.
- `PREFIX` - The bot prefix. Can be `.` or even `yeet` or whatever the fuck you want.
- `COLOUR` - Embed colour represented by integer value.
- `AVATAR` - Not the bot avatar actually. It's just the image that appears on a buncha embeds.
- `USERAGENT` - The reddit user agent for your app.
- `CLIENT_ID` - The reddit client ID for your app.
- `CLIENT_SECRET` - The reddit client secret for your app.
- `USERNAME` - Your reddit username.
- `PASSWORD` - Your reddit password.

## Random Bullshit

The bot is uhhhhhhh very much specialized to my very specific needs. If you're not in the servers it's built for, you'll have to take some extra steps.

Remove `.addCommandDir(path.join(__dirname, 'refugee'))` in `index.js` and kill the refugee folder if you want. Some event listeners only work inside a specific server. You'll need to change a bunch of IDs if you want them to work inside another server. Idk I'd love this to be organized better but I really suck at this.

***

And that's it! Submit a PR if you want to contribute. As a terrible dev, I refuse to have due process for contributing.
