const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    color,
    listemoji
} = require("../config.json");
const {
    distube
} = require('./play');
const {
    MessageEmbed
} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Mischt die aktuelle Warteschlange durch'),
    async execute(interaction) {
        if (interaction.member.nickname != null) {
            nick = interaction.member.nickname;
        } else {
            nick = interaction.user.username;
        }
        userpp = interaction.user.avatarURL();
        try {
            queue = distube.getQueue(interaction.guildId)
            if (queue.songs.length >= 1 && queue) {
                distube.shuffle(interaction.guildId);
                const embedshuffle = new MessageEmbed()
                    .setColor(`${color}`)
                    .setTitle(`Warteschlange wurde gemischt`)
                    .setDescription(`${listemoji} Lieder wurden erfolgreich durchgemischt`)
                    .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
                interaction.reply({
                    embeds: [embedshuffle]
                });
            }
        } catch (e) {
            console.log(e);
            const embedshufflefail = new MessageEmbed()
                .setColor(`${color}`)
                .setTitle(`${listemoji} Ich konnte keine Lieder durch mischen, da keine Lieder in einer Warteschlange sind`)
                .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
            interaction.reply({
                ephemeral: true,
                embeds: [embedshufflefail]
            });
        }
    },
};