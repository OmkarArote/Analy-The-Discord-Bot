// Getting env variables
require('dotenv').config();
const { DISCORD_BOT_TOKEN = '' } = process.env;

// Setting up the required libs
const { Client, GatewayIntentBits } = require('discord.js');
const { OpenAI } = require('openai');

const openai = new OpenAI(process.env.OPENAI_API_KEY);

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
        message.reply(`Your query has been recorded. Please wait for the response.`);

        try {
            // Generate response using OpenAI GPT API
            const response = await openai.chat.completions.create({
                messages: [{ role: "system", content: userQuery }],
                model: "gpt-3.5-turbo",
                // prompt: userQuery,
                // maxTokens: 150
            });
            // Reply to the user with the generated response
            message.reply(response.data.choices[0].text.trim());
        } catch (err) {
            console.error('Error generating response:', err);
            message.reply('An error occurred while processing your query. Please try again later.');
        }

        // Here you can store the user's query and response in your database
        // For example, you can use MongoDB to store this data
        // You can call a function to store the data in your database
        // storeUserQueryResponse(message.author.id, userQuery, response);
    }
});

client.login(DISCORD_BOT_TOKEN);