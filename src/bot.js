// Getting env variables
require('dotenv').config();
const { DISCORD_BOT_TOKEN = '' } = process.env;

// Setting up the required libs
const { Client, GatewayIntentBits } = require('discord.js');

// Setting up client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.login(DISCORD_BOT_TOKEN);