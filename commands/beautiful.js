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
const canvacord = require("canvacord");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('beautiful')
        .addMentionableOption(option => option.setName('mention').setRequired(true).setDescription("Erwähne hier eine Person"))
        .setDescription('Ist einfach hübsch kann man nichts gegen sagen'),
    async execute(interaction) {
        if (interaction.member.nickname != null) {
            nick = interaction.member.nickname;
        } else {
            nick = interaction.user.username;
        }
        userpp = interaction.user.avatarURL();
        mentionedUser = interaction.options.get('mention').user.avatarURL({ dynamic: false, format: 'png' });
        image = await canvacord.Canvacord.beautiful(mentionedUser.toString());
        let attachment = await new MessageAttachment(image, "beautiful.png");
        const embedbeautiful = new MessageEmbed()
            .setColor(`${color}`)
            .setImage('attachment://beautiful.png')
            .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
        await interaction.reply({
            embeds: [embedbeautiful],
            files: [attachment]
        });
    },
};