// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token, testchannel, esvToken } = require('./config.json');
const dateToday = new Date(Date.now()).toDateString().slice(4);
const VOTDChannelID = testchannel;

// Bible Verse Array
const votdCandidates = [
    'John 3:16'
]

// Create a new client instance
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds] 
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);

    // verseOfTheDay(votdCandidates[0]);
});

// Verse of the Day - !! Important that it is run after the Client is Ready!
async function verseOfTheDay(verseID) {
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
            },
            "footer": {
              "text": `All texts are taken from the English Standard Version - © 2001 – 2023 Crossway`,
              "icon_url": `https://i.imgur.com/BB53OUZ.png`
                }
            }
        ]
    }

    client.channels.cache.get(testchannel).send(message);
}

// Log in to Discord with your client's token
client.login(token);

// Eggy does not agree with copyright standards, therefore I am dropping off the project.