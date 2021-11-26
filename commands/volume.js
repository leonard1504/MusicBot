const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    color,
    musicemoji
} = require("../config.json");
const {
    distube
} = require('./play');
const {
    MessageEmbed
} = require('discord.js');
let volume;
module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .addIntegerOption(option => option.setName('lautstärkepegel').setRequired(false).setDescription("Gebe hier deine Lautstärke in Prozent an"))
        .setDescription('Passe die Lautstärke an'),
    async execute(interaction) {
        if (interaction.member.nickname != null) {
            nick = interaction.member.nickname;
        } else {
            nick = interaction.user.username;
        }
        userpp = interaction.user.avatarURL();
        try {
            queue = distube.getQueue(interaction.guildId);
            if (interaction.options.get('lautstärkepegel').value != null) {
                volume = interaction.options.get('lautstärkepegel').value;
            }
            if (queue.songs.length >= 1 && queue && volume) {
                distube.setVolume(queue, volume);
                const embedsetvolume = new MessageEmbed()
                    .setColor(`${color}`)
                    .setTitle(`Lautstärke angepasst`)
                    .setDescription(`${musicemoji} Lautstärke ist nun ${volume}%`)
                    .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
                interaction.reply({
                    embeds: [embedsetvolume]
                });
            }
        } catch (e) {
            if (queue === undefined) {
                const embedvolumefail = new MessageEmbed()
                    .setColor(`${color}`)
                    .setTitle(`Ich konnte die Lautstärke nicht anpassen, da momentan kein Lied läuft`)
                    .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
                interaction.reply({
                    ephemeral: true,
                    embeds: [embedvolumefail]
                });
            } else if (queue.songs.length >= 1 && queue) {
                volume = queue.volume;
                const embedsetvolume = new MessageEmbed()
                    .setColor(`${color}`)
                    .setTitle(`Momentane Lautstärke`)
                    .setDescription(`${musicemoji} Lautstärke ist momentan auf ${volume}%`)
                    .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
                interaction.reply({
                    embeds: [embedsetvolume]
                });
            }
        }
    },
};