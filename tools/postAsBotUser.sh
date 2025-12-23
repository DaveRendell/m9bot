# Standalone script to post messages as the bot user. Mostly for trolling.

CHANNEL_ID=$1
MESSAGE=$2

TOKEN=$(cat config.json | jq -r .discord.token )

curl \
-H "Authorization: Bot $TOKEN" \
-H "User-Agent: myBotThing (http://some.url, v0.1)" \
-H "Content-Type: application/json" \
-X POST \
-d "{\"content\":\"$MESSAGE\"}" \
https://discordapp.com/api/channels/$CHANNEL_ID/messages
