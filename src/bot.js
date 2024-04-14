// Getting env variables
require('dotenv').config();
const { DISCORD_BOT_TOKEN = '' } = process.env;

// Setting up the required libs
const { Client, GatewayIntentBits } = require('discord.js');

// Setting up client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    console.log('message:: ', message);
    // Check if the message starts with '#analyQuery'
    if (message.content.startsWith('#analyQuery')) {
        // Extract the user's query
        const userQuery = message.content.substring('#analyQuery'.length).trim();

        console.log('userQuery:: ', userQuery);
        // Reply to the user acknowledging their query
        // message.reply(`Your query "${userQuery}" has been recorded. Please wait for the response.`);

        // Here you can store the user's query and response in your database
        // For example, you can use MongoDB to store this data
        // You can call a function to store the data in your database
        // storeUserQueryResponse(message.author.id, userQuery, response);
    }
});

client.login(DISCORD_BOT_TOKEN);