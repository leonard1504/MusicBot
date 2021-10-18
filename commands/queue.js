const { SlashCommandBuilder } = require('@discordjs/builders');
const { color, stopwatchemoji, musicemoji, listemoji } = require("../config.json");
const { distube } = require('./play');
const { MessageEmbed } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Zeigt die ersten 20 Lieder in der Wartschlange an'),
	async execute(interaction) {
        if (interaction.member.nickname != null) {
            nick = interaction.member.nickname;
        } else {
            nick = interaction.user.username;
        }
        userpp = interaction.user.avatarURL();
        try {
            queue = distube.getQueue(interaction.guildId);
            showqueue = queue.songs.map((song, id) => `**${id+1}**.${musicemoji} ${song.name} - ${stopwatchemoji} ${song.formattedDuration}`).join("\n");
            showqueue20 = showqueue.split('**21**.')[0].toString();
            if(queue.songs.length >= 1 && queue) {
                const embedqueue = new MessageEmbed()
                    .setColor(`${color}`)
                    .setTitle(`Warteschlange`)
                    .setDescription(`${listemoji} Hier sind die ersten 20 Lieder die momentan in der Wartschlange sind \n\n${showqueue20}`)
                    .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
                interaction.reply({ embeds: [embedqueue] });
            }
        } catch(e) {
            const embedqueuefail = new MessageEmbed()
                .setColor(`${color}`)
                .setTitle(`Es sind **keine** Lieder in der Warteschlange ${listemoji}`)
                .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
            interaction.reply({ ephemeral: true, embeds: [embedqueuefail] });
        }
    },
};