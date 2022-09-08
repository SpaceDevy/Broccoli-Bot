const { getVoiceConnection } = require("@discordjs/voice");
module.exports = {
    name: "seek",
    description: "Seeks to a specific Position (sec)",
    run: async (client, message, args, prefix) => {
        try {
            if(!message.member.voice.channelId) return message.reply({content: "<:oddno:968555009908293652> **Please join a Voice-Channel first!**"}).catch(() => null);
            
            const oldConnection = getVoiceConnection(message.guild.id);
            if(!oldConnection) return message.reply({content: "<:oddno:968555009908293652> **I'm not connected somewhere!**"}).catch(() => null);
            if(oldConnection && oldConnection.joinConfig.channelId != message.member.voice.channelId) return message.reply({content: "<:oddno:968555009908293652> **We are not in the same Voice-Channel**!"}).catch(() => null);
            
            const queue = client.queues.get(message.guild.id); // get the queue
            if(!queue || !queue.tracks || !queue.tracks[0]) { 
                return message.reply(`<:oddno:968555009908293652> **Nothing playing right now**`).catch(() => null);
            }

            if(!args[0] || isNaN(args[0])) return message.reply({ content: `<:oddno:968555009908293652> **You forgot to add the seeking-time!** Usage: \`${prefix}seek <Time-In-S>\``}).catch(() => null);
            
            if(Number(args[0]) < 0 || Number(args[0]) > Math.floor(queue.tracks[0].duration / 1000 - 1))
            return message.reply({ content: `<:oddno:968555009908293652> **The Seek-Number-Pos must be between \`0\` and \`${Math.floor(queue.tracks[0].duration / 1000 - 1)}\`!**`}).catch(() => null);
            
            const newPos = Number(args[0]) * 1000;
            // set Filterschanged to true
            queue.filtersChanged = true;
            // seek
            oldConnection.state.subscription.player.stop();
            oldConnection.state.subscription.player.play(client.getResource(queue, queue.tracks[0].id, newPos));
            
            message.reply({content: `<:oddskip:968654971593699368> **Seeked to \`${client.formatDuration(newPos)}\`**!`}).catch(() => null);
        } catch(e) { 
            console.error(e);
            message.reply({content: `<:oddno:968555009908293652> Could not join your VC because: \`\`\`${e.message || e}`.substring(0, 1950) + `\`\`\``}).catch(() => null);
        }
    },
};