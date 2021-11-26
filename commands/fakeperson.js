const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    MessageEmbed,
    MessageAttachment
} = require('discord.js');
const {
    color
} = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fakeperson')
        .setDescription('Zeigt dir ein Bild einer Person die nicht existiert'),
    async execute(interaction) {
        if (interaction.member.nickname != null) {
            nick = interaction.member.nickname;
        } else {
            nick = interaction.user.username;
        }
        const attachment = new MessageAttachment("https://thispersondoesnotexist.com/image", 'person-image.png');
        userpp = interaction.user.avatarURL();
        const embedpoke = new MessageEmbed()
            .setColor(`${color}`)
            .setImage('attachment://person-image.png')
            .setFooter(`Bild von https://thispersondoesnotexist.com/ \nAusgeführt von:  ${nick}`, `${userpp}`);
        await interaction.reply({
            embeds: [embedpoke],
            files: [attachment]
        });
    },
};