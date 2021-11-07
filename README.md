# 🇲9️⃣🤖
Bot for the M9 Discord server

## Usage
- Set your birthday to get birthday notifications: post a message on Discord
  with the format `set birthday YYYY-MM-DD`. The bot will reply if your message
  was successfully added.
- List all upcoming birthdays my posting the following message on Discord:
  `list birthdays`.
- Pin messages by reacting with the 📌 emoji (may not work great for older
  messages)
- Emoji react to the message in the set roles channel to self assign certain roles. 
- [Admins only] Add a role that users can self assign with
  `add_self_service_role [tag the role here] [emoji for the role] [description]`
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
### First time setup
These instructions are based on my experience deploying the bot to a Raspberry
Pi. Different systems will probably require a bit of trial and error.

**Create a system service**: Create a file at `/etc/systemd/system/m9bot.service`, containing the following:
```ini
[Unit]
Description=M9 Discord bot service
After=network.target

[Service]
Environment="NODE_ENV=production"
Environment="NODE_PATH=/home/pi/m9bot/dist"
ExecStart=/home/pi/.nvm/versions/node/v15.11.0/bin/node /home/pi/m9bot/dist/src/main.js
WorkingDirectory=/home/pi/m9bot    
StandardOutput=inherit
StandardError=inherit
Restart=always
User=pi

[Install]
WantedBy=multi-user.target
```

Next, run the script `npm run deploy --server=pi@<raspberrypi IP Address>`, to
run the automated deploy script. You'll want to have set up your SSH keys to 
allow passwordless access to the Pi if possible. See `deploy.sh` to better 
understand what the script does.

**Copy config** Copy the config file `config.json` to `~/m9bot/dist/config.json`
on the Raspberry Pi.

**Set the service to run at startup** Run `sudo systemctl enable m9bot` to make
the service run when the Pi starts up.

**Check logs** Run `journalctl -u m9bot -b` to see the service logs.

**Updating the deployment** Running 
`npm run deploy --server=pi@<raspberrypi IP Address>` again should automatically
update the deployment on the Pi to the version you have locally.