const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    MessageEmbed
} = require('discord.js');
const {
    color
} = require('../config.json');

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName('pokefusion')
        .setDescription('Kombiniert zwei zufällige Pokémons miteinander'),
    async execute(interaction) {
        if (interaction.member.nickname != null) {
            nick = interaction.member.nickname;
        } else {
            nick = interaction.user.username;
        }
        const a = getRandomInt(152);
        const b = getRandomInt(152);
        userpp = interaction.user.avatarURL();
        const embedpoke = new MessageEmbed()
            .setColor(`${color}`)
            .setImage(`https://images.alexonsager.net/pokemon/fused/${a}/${a}.${b}.png`)
            .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
        await interaction.reply({
            embeds: [embedpoke]
        });
    },
};