const mySecret = process.env['TOKEN']
const { Client, Intents, Collection, MessageEmbed } = require('discord.js'); //v13
const { getVoiceConnection } = require("@discordjs/voice");
const client = new Client(clientSettingsObject());

const express = require('express')
const app = express();
const port = 3000

const path = require('path')
app.use('/', express.static(path.join(__dirname, './public')));
app.use('/privacy-policy', express.static(path.join(__dirname, './public/privacy-policy.html')));

app.listen(port, () =>
console.log(`${client.getTime()} Running at ${port} port.`)
);

// Slash Commands deployment settings
client.deploySlash = {
  enabled: true,
  guild: false, // false | "ID" (if it's false, just set global once, and then never needed again!)
}
// Global config file
client.config = require("./config/config.json");

// Create global collection
client.commands = new Collection();
client.slashCommands = new Collection();
client.queues = new Collection();

// load music-util-function
require("./util/musicUtils.js")(client);

// load handler
require("./util/handler.js")(client);

//client.login(process.env.TOKEN);
client.login(mySecret);

function clientSettingsObject() {
  return {
    shards: "auto",
    allowedMentions: {
      parse: ["roles", "users", /* "everyone" */],
      repliedUser: false, //set true if you want to ping the bot on reply messages
    },
    failIfNotExists: false,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: [ 
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
}
}