const { SlashCommandBuilder } = require("discord.js");
const { botName } = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('copyright')
        .setDescription('Provides copyright information'),
    async execute(interaction) {
        message = {
              "channel_id": `${interaction.channel_id}`,
              "content": "",
              "tts": false,
              "embeds": [
                {
                  "type": "rich",
                  "title": `Copyright information for ${botName}`,
                  "description": `Below you can find copyright information regarding the services and APIs used in this discord bot.`,
                  "color": 0x00FFFF,
                  "fields": [
                    {
                      "name": `ESV Translation - Crossway`,
                      "value": `Unless otherwise indicated, all Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), copyright © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved. The ESV text may not be quoted in any publication made available to the public by a Creative Commons license. The ESV may not be translated into any other language.\n\nUsers may not copy or download more than 500 verses of the ESV Bible or more than one half of any book of the ESV Bible.`,
                      "inline": true
                    }
                  ]
                }
              ]
        }

        await interaction.reply(
            message
        )
    }
}

