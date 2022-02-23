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
        .setName('kiss')
        .addMentionableOption(option => option.setName('mention').setRequired(true).setDescription("Erwähne hier eine Person"))
        .addMentionableOption(option => option.setName('mention2').setRequired(true).setDescription("Erwähne hier eine Person"))
        .setDescription('Da ist ein Monster unter meinem Bett'),
    async execute(interaction) {
        if (interaction.member.nickname != null) {
            nick = interaction.member.nickname;
        } else {
            nick = interaction.user.username;
        }
        userpp = interaction.user.avatarURL();
        mentionedUser = interaction.options.get('mention').user.avatarURL({ dynamic: false, format: 'png' });
        mentionedUser2 = interaction.options.get('mention2').user.avatarURL({ dynamic: false, format: 'png' });
        image = await canvacord.Canvacord.kiss(mentionedUser.toString(), mentionedUser2.toString());
        let attachment = await new MessageAttachment(image, "kiss.png");
        const embedkiss = new MessageEmbed()
            .setColor(`${color}`)
            .setImage('attachment://kiss.png')
            .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
        await interaction.reply({
            embeds: [embedkiss],
            files: [attachment]
        });
    },
};