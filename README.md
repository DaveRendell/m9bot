# m9bot
Bot for the M9 Discord server

## Running the bot
### Installing dependencies
Just run `npm install` or `npm i`

### Discord bot token

**First time setup** - create a new application on the 
[Discord developer portal](https://discord.com/developers/applications), and
create a Bot user for that application. Generate a new token for your bot.
Next copy `discordToken.template.json` to `discordToken.json`, and paste your 
bot's token into the JSON blob.

If the bot user has already been set up by someone else, ask for them to send
you a copy of `discordToken.json` and copy it to the root of this git 
repository.

### Running in development mode
Run `npm run dev` to launch in nodemon with hot reloading of code

### Running in production mode
Run `npm start` to run the build, the linting, and then launch the bot in 
production mode.

## Running tests
Run `npm test` to run the tests.
