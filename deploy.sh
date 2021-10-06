SERVER=$npm_config_server
SERVICE_NAME=m9bot

if [ -z $SERVER ]
then
  echo "Please specify a server IP to deploy to, e.g. 'npm run deploy --server=pi@192.168.0.54'"
  exit 1
fi

echo "Preparing to deploy $SERVICE_NAME to $SERVER.\n"

echo "Building project locally\n"

npm run build

ssh_command () {
  ssh -o LogLevel=QUIET $SERVER $1
}

echo "Stopping service on server"
ssh_command "sudo systemctl stop $SERVICE_NAME"

echo "Updating files..."
ssh_command "rm -rf ~/$SERVICE_NAME/dist/src"
ssh_command "rm ~/$SERVICE_NAME/package.json"
scp -r dist/src $SERVER:~/$SERVICE_NAME/dist/
scp package.json $SERVER:~/$SERVICE_NAME/package.json

echo "Downloading dependencies on server"
# Bit of a hack to get NPM to work through the ssh terminal here.
ssh_command "source ~/.nvm/nvm.sh && cd ~/$SERVICE_NAME/ && npm install --only=prod"

echo "Restarting service"
ssh_command "sudo systemctl start $SERVICE_NAME"

echo "\nDeployment complete."
