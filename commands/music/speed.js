const { getVoiceConnection } = require("@discordjs/voice");
module.exports = {
    name: "speed",
    description: "Changes the Speed of the Music",
    run: async (client, message, args, prefix) => {
        if(!message.member.voice.channelId) return message.reply("<:oddno:968555009908293652> **Please join a Voice-Channel first!**").catch(() => null);
        // get an old connection
        const oldConnection = getVoiceConnection(message.guild.id);
        if(!oldConnection) return message.reply("<:oddno:968555009908293652> **I'm not connected somewhere!**")
        if(oldConnection && oldConnection.joinConfig.channelId != message.member.voice.channelId) return message.reply("<:oddno:968555009908293652> **We are not in the same Voice-Channel**!").catch(() => null);
        
        const queue = client.queues.get(message.guild.id); // get the queue
        if(!queue) { 
            return message.reply(`<:oddno:968555009908293652> **Nothing playing right now**`);
        }
        if(args[0] === undefined || isNaN(args[0]) || Number(args[0]) < 50 || Number(args[0]) > 300) return message.reply(`<:oddno:968555009908293652> **No __valid__ Bassboost-Level between 50 and 300 % provided!** (100 % == normal speed)\n Usage: \`${prefix}speed 125\``).catch(() => null);
        const speed = Number(args[0]);
        queue.effects.speed = Math.floor(speed) / 100;

        // change the Basslevel
        queue.filtersChanged = true;
        const curPos = oldConnection.state.subscription.player.state.resource?.playbackDuration || 0;
        oldConnection.state.subscription.player.stop();
        oldConnection.state.subscription.player.play(client.getResource(queue, queue.tracks[0].id, curPos));
    
        return message.reply(`<:oddmu:968552025723928647> **Successfully changed the Speed to \`${Math.floor(speed) / 100}x\` of the Original Speed (${speed}%)**`).catch(() => null);
    },
};