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

client.on('messageCreate', async (message) => {
    // Check if the message starts with your preferred prefix (e.g., '#analyQuery')
    if (message.content.startsWith('#analyQuery')) {
      const userQuery = message.content.substring('#analyQuery'.length).trim();
  
      // Send an initial response indicating query processing
      message.reply(`Your query has been received. Please wait for the response.`);
  
      try {
        // Generate response using OpenAI GPT API
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo", // Consider using a more suitable model
          messages: [{ role: "user", content: userQuery }],
          max_tokens: 15, // Adjust token limit as needed
          temperature: 0.7, // Adjust temperature for response creativity
          top_p: 1.0, // Adjust for more likely vs. surprising responses
        });
  
        // Reply to the user with the generated response
        message.reply(response.data.choices[0].text.trim());
      } catch (err) {
        console.error('Error generating response:', err);
        message.reply('An error occurred while processing your query. Please try again later.');
      }
    }
  });

client.login(DISCORD_BOT_TOKEN);