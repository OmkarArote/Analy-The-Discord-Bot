// Getting env variables
require('dotenv').config();
const { DISCORD_BOT_TOKEN = '', GOOGLE_API_TOKEN = '' } = process.env;

// Setting up the required libs
const { Client, GatewayIntentBits } = require('discord.js');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Declaring Constants
const MODEL = "gemini-pro";

// Google Gemini Api
const ai = new GoogleGenerativeAI(GOOGLE_API_TOKEN);
const model = ai.getGenerativeModel({ model: MODEL });

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

client.on('messageCreate', async (message) => {
  // Bots Message Must Be Ignored
  if (message?.author?.bot) return;

  // Check if the message starts with your preferred prefix (e.g., '#analyQuery')
  if (message.content.startsWith('#analyQuery')) {
    const userQuery = message.content.substring('#analyQuery'.length).trim();

    // Send an initial response indicating query processing
    message.reply(`Your query has been received. Please wait for the response.`);

    try {
      // Generate response using GoogleAI API
      const { response } = await model.generateContent(userQuery);
      message.reply({ content: response.text() });

      // Reply to the user with the generated response
    } catch (err) {
      console.error('Error generating response:', err);
      message.reply('An error occurred while processing your query. Please try again later.');
    }
  }
});

client.login(DISCORD_BOT_TOKEN);