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
        .setName('trash')
        .addMentionableOption(option => option.setName('mention').setRequired(true).setDescription("Erwähne hier eine Person"))
        .setDescription('Schau nochmal genauer hin das scheint Müll zu sein'),
    async execute(interaction) {
        if (interaction.member.nickname != null) {
            nick = interaction.member.nickname;
        } else {
            nick = interaction.user.username;
        }
        userpp = interaction.user.avatarURL();
        mentionedUser = interaction.options.get('mention').user.avatarURL({ dynamic: false, format: 'png' });
        image = await canvacord.Canvacord.trash(mentionedUser.toString());
        let attachment = await new MessageAttachment(image, "trash.png");
        const embedtrash = new MessageEmbed()
            .setColor(`${color}`)
            .setImage('attachment://trash.png')
            .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
        await interaction.reply({
            embeds: [embedtrash],
            files: [attachment]
        });
    },
};