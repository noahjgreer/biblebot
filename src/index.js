require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const schedule = require("node-schedule");
const BIBLE_API_KEY = process.env.BIBLE_API_KEY;
var currentDate = new Date();
var desiredVerseOfTheDaySendout = currentDate.getMinutes + 2;
var desiredVOTDSendoutInMS = new Date(desiredVerseOfTheDaySendout).getTime - new Date().getTime;

const DAILY_VERSES = [
    `JER.29.11`,
    `PSA.23`,
    `1COR.4.4-8`,
    `PHP.4.13`,
    `JHN.3.16`,
    `ROM.8.28`,
    `ISA.41.10`,
    `PSA.46.1`,
    `GAL.5.22-23`,
    `HEB.11.1`,
    `2TI.1.7`,
    `1COR.10.13`,
    `PRO.22.6`,
    `ISA.40.31`,
    `JOS.1.9`,
    `HEB.12.2`,
    `MAT.11.28`,
    `ROM.10.9-10`,
    `PHP.2.3-4`,
    `MAT.5.43-44`,
]

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})

client.on('ready', (c) => {
    console.log(`${c.user.tag} is up and running.`)
})

client.on('messageCreate', (message) => {
    if (message.author.bot) {
        return;
    }

    if (message.content === "test") {
        message.reply('Hello World')
    }
})

client.on("interactionCreate", (interaction) => {
    if (!interaction.isChatInputCommand()) {
        return;
    }

    if (interaction.commandName === 'test') {
        interaction.reply('The slash-command test was successful.');
    }
});

async function fetchVerse(verseID) {
    const response = await fetch(
        `https://api.scripture.api.bible/v1/bibles/${BIBLE_API_KEY}/search?query=${verseID}`,
        {
            method: "GET"
        }
    )
    const data = await response.json;
    console.log(data);

    // return new Promise((resolve, reject) => {
    //   const xhr = new XMLHttpRequest();
    //   xhr.withCredentials = false;
  
    //   xhr.addEventListener(`readystatechange`, function () {
    //     if (this.readyState === this.DONE) {
    //       const { data, meta } = JSON.parse(this.responseText);
  
    //       _BAPI.t(meta.fumsId);
    //       resolve(data);
    //     }
    //   });
  
    //   xhr.open(
    //     `GET`,
    //   );
    //   xhr.setRequestHeader(`api-key`, API_KEY);
  
    //   xhr.onerror = () => reject(xhr.statusText);
  
    //   xhr.send();
    // });
  }

schedule.scheduleJob(`37 18 * * *`, () => {
    var verse = fetchVerse(3); 
    const channel = client.channels.cache.get('1113608763761512582');

    channel.send({
        "channel_id": `${channel}`,
        "content": "",
        "tts": false,
        "embeds": [
          {
            "type": "rich",
            "title": `Verse of the Day:`,
            "description": `${verse}`,
            "color": 0xb98282
          }
        ]
      });
})

fetchVerse(3);

client.login(process.env.TOKEN)
// console.log(channel);