const { getVoiceConnection } = require("@discordjs/voice");
module.exports = {
    name: "bassboost",
    args: ["bass", "bb"],
    description: "Changes the Bassboost Level of the Music",
    options: [
        {
            name: "gain_level",
            description: "Bassboost level between 0 and 20",
            type: "INTEGER",
            required: true,
        },
    ],
    run: async (client, interaction, args, prefix) => {
        if(!interaction.member.voice.channelId) return interaction.reply({ ephemeral: true, content: "<:oddno:968555009908293652> **Please join a Voice-Channel first!**"}).catch(() => null);
        const oldConnection = getVoiceConnection(interaction.guild.id);
        if(!oldConnection) return interaction.reply({ ephemeral: true, content: "<:oddno:968555009908293652> **I'm not connected somewhere!**" })
        if(oldConnection && oldConnection.joinConfig.channelId != interaction.member.voice.channelId) return interaction.reply({ ephemeral: true, content: "<:oddno:968555009908293652> **We are not in the same Voice-Channel**!"}).catch(() => null);
        
        const queue = client.queues.get(interaction.guild.id);
        if(!queue) { 
            return interaction.reply({ ephemeral: true, content: `<:oddno:968555009908293652> **Nothing playing right now**`});
        }
        if(args[0] === undefined || isNaN(args[0]) || Number(args[0]) < 0 || Number(args[0]) > 20) return interaction.reply({ ephemeral: true, content: `<:oddno:968555009908293652> **No __valid__ Bassboost-Level between 0 and 20 db provided!** Usage: \`${prefix}bassboost 6\``}).catch(() => null);
        const bassboost = Number(args[0]);
        queue.effects.bassboost = bassboost;
        queue.filtersChanged = true;
        const curPos = oldConnection.state.subscription.player.state.resource.playbackDuration;
        oldConnection.state.subscription.player.stop();
        oldConnection.state.subscription.player.play(client.getResource(queue, queue.tracks[0].id, curPos));
    
        return interaction.reply({ ephemeral: false, content: `<:oddv:968567000307736607> **Successfully changed the Bassboost-Level to \`${bassboost}db\`**`}).catch(() => null);
    },
};