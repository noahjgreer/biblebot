const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [
    {
        name: 'test',
        description: 'Replies with a response.',
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Attempting to register commands...');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            {
                body: commands
            }
        )

        console.log('Command Registration Successful.')
    } catch (error) {
        console.log(`An error occurred during a command operation; ${error}`);
    }
})();