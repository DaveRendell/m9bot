# 🇲9️⃣🤖
Bot for the M9 Discord server

## Usage
- Set your birthday to get birthday notifications: post a message on Discord
  with the format `set birthday YYYY-MM-DD`. The bot will reply if your message
  was successfully added.
- More to come...

## Development

### Installing dependencies
Just run `npm install` or `npm i`

### Discord bot token
If the bot user has already been set up by someone else, ask for them to send
you a copy of `config.json` and copy it to the root of this git repository.

**First time setup** - create a new application on the 
[Discord developer portal](https://discord.com/developers/applications), and
create a Bot user for that application. Generate a new token for your bot. Make
sure the bot has the 'Presence Intent' permission enabled.

Next copy `config.template.json` to `config.json`, and paste your 
bot's token into the JSON blob.

Grab the channel ID for the channel you want the bot to post birthday messages
to (Enable developer mode in Discord to easily access channel IDs), and add that
to the config file as well.

### Running in development mode
Run `npm run dev` to launch in nodemon with hot reloading of code

### Running tests
Run `npm test` to run the tests. Check test coverage with `npm run coverage`

## Deployment
Todo...