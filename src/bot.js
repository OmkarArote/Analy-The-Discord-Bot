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
    const processingMsg = await message.reply(`Your query has been received. Please wait for the response.`);

    try {
      // Generate response using GoogleAI API
      const { response } = await model.generateContent(userQuery);
      const answerMsg = await message.reply({ content: response.text() });

      // Reply to the user with the generated response
      // Ask for rating and feedback
      await message.channel.send(`Please rate the answer on a scale of 0 to 5 by typing: #rate <rating>`);
      await message.channel.send(`You can also provide feedback by typing: #feedback <your feedback>`);

      // Collect rating and feedback
      const filter = (responseMessage) => responseMessage.author.id === message.author.id;
      const collector = message.channel.createMessageCollector({ filter, time: 60000 }); // Adjust time limit as needed

      collector.on('collect', async (responseMessage) => {
        const content = responseMessage.content.trim().toLowerCase();
        if (content.startsWith('#rate')) {
          const rating = parseInt(content.split(' ')[1]);
          if (!isNaN(rating) && rating >= 0 && rating <= 5) {
            // Process rating
            // You can save the rating or perform any other action here
            await message.channel.send(`Thank you for rating! You rated ${rating} stars.`);
            collector.stop();
          } else {
            await message.channel.send(`Please provide a valid rating between 0 and 5.`);
          }
        } else if (content.startsWith('#feedback')) {
          const feedback = content.substring('#feedback'.length).trim();
          // Process feedback
          // You can save the feedback or perform any other action here
          await message.channel.send(`Thank you for your feedback: ${feedback}`);
          collector.stop();
        }
      });

      collector.on('end', async (collected, reason) => {
        if (reason === 'time') {
          // Collector timed out
          await message.channel.send(`You didn't provide rating or feedback within the time limit.`);
        }
      });
    } catch (err) {
      console.error('Error generating response:', err);
      message.reply('An error occurred while processing your query. Please try again later.');
    }
  }
});


// client.on('messageCreate', async (message) => {
//   // Bots Message Must Be Ignored
//   if (message?.author?.bot) return;

//   // Check if the message starts with your preferred prefix (e.g., '#analyQuery')
//   if (message.content.startsWith('#analyQuery')) {
//     const userQuery = message.content.substring('#analyQuery'.length).trim();

//     // Send an initial response indicating query processing
//     message.reply(`Your query has been received. Please wait for the response.`);

//     try {
//       // Generate response using GoogleAI API
//       const { response } = await model.generateContent(userQuery);
//       message.reply({ content: response.text() });

//       // Reply to the user with the generated response
//     } catch (err) {
//       console.error('Error generating response:', err);
//       message.reply('An error occurred while processing your query. Please try again later.');
//     }
//   }
// });

client.login(DISCORD_BOT_TOKEN);