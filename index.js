// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token, testchannel, esvToken, votdCandidates } = require('./config.json');
const nodeCron = require('node-cron');
const dateToday = new Date(Date.now()).toDateString().slice(4);
const VOTDChannelID = testchannel;

// Create a new client instance
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds] 
});

// Client Command Handler
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!', ephemeral: true
      })
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!', ephemeral: true
      })
    }
  }

  console.log(interaction);
})

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);

  // verseOfTheDay();
});

// Verse of the Day - !! Important that it is run after the Client is Ready!
async function verseOfTheDay() {
    const verseID = votdCandidates[Math.floor(Math.random() * (votdCandidates.length))];
    console.log(verseID);

    // Setting up variables
    const apiURL = new URL("https://api.esv.org/v3/passage/text/");
    const parameters = {
        'q': verseID,
        'include-headings': false,
        'include-footnotes': false,
        'include-verse-numbers': false,
        'include-short-copyright': false,
        'include-passage-references': false
    }
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `${esvToken}`,
    }

    // Adding Parameters to the API Url for fetching
    for (let k in parameters) {
        apiURL.searchParams.append(k, parameters[k]); 
    }

    // Fetch the verse
    const response = await fetch(apiURL, {
        headers: headers
    });

    // Recieve and Log
    const data = await response.json();
    const message = {
        "channel_id": `${VOTDChannelID}`,
        "content": "",
        "tts": false,
        "embeds": [
          {
            "type": "rich",
            "title": `The Verse of the Day - ${dateToday}`,
            "description": `Here is today's verse of the day.`,
            "color": 0xb36c6c,
            "fields": [
              {
                "name": `${verseID}`,
                "value": `${data.passages[0]}`
              }
            ],
            "thumbnail": {
              "url": `https://clipart-library.com/new_gallery/438134_bible-logo-png.png`,
              "height": 256,
              "width": 256
            }
            }
        ]
    }

    client.channels.cache.get(testchannel).send(message);
}

nodeCron.schedule('0 10 * * *', () => {
  verseOfTheDay();
});

// Log in to Discord with your client's token
client.login(token);

// Eggy does not agree with copyright standards, therefore I am dropping off the project.