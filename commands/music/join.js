const { getVoiceConnection } = require("@discordjs/voice");
const { Permissions } = require("discord.js");
module.exports = {
    name: "join",
    description: "Joins a Voice Channel",
    run: async (client, message, args, prefix) => {
        try {
            if(!message.member.voice.channelId) return message.reply({content: "<:oddno:968555009908293652> **Please join a Voice-Channel first!**"}).catch(() => null);
            
            const oldConnection = getVoiceConnection(message.guild.id);
            if(oldConnection) return message.reply({ content: `<:oddno:968555009908293652> **I'm already connected in <#${oldConnection.joinConfig.channelId}>**!`}).catch(() => null);
            
            if(!message.member.voice.channel?.permissionsFor(message.guild?.me)?.has(Permissions.FLAGS.CONNECT)) {
                return message.reply({content: `<:oddno:968555009908293652> **I'm missing the Permission to Connect to your Voice-Channel!**`}).catch(() => null);
            }
            if(!message.member.voice.channel?.permissionsFor(message.guild?.me)?.has(Permissions.FLAGS.SPEAK)) {
                return message.reply({content: `<:oddno:968555009908293652> **I'm missing the Permission to speak in your Voice-Channel!**`}).catch(() => null);
            }

            await client.joinVoiceChannel(message.member.voice.channel);
            message.reply({content: "<:oddse:968557685500948520> **Joined your VC!**"}).catch(() => null);
        } catch(e) { 
            console.error(e);
            message.reply({content: `<:oddno:968555009908293652> Could not join your VC because: \`\`\`${e.message || e}`.substring(0, 1950) + `\`\`\``}).catch(() => null);
        }
    },
};
