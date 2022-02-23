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
        .setName('hitler')
        .addMentionableOption(option => option.setName('mention').setRequired(true).setDescription("Erwähne hier eine Person"))
        .setDescription('Nein das wird meinem Kind nicht schaden'),
    async execute(interaction) {
        if (interaction.member.nickname != null) {
            nick = interaction.member.nickname;
        } else {
            nick = interaction.user.username;
        }
        userpp = interaction.user.avatarURL();
        mentionedUser = interaction.options.get('mention').user.avatarURL({ dynamic: false, format: 'png' });
        image = await canvacord.Canvacord.hitler(mentionedUser.toString());
        let attachment = await new MessageAttachment(image, "hitler.png");
        const embedhitler = new MessageEmbed()
            .setColor(`${color}`)
            .setImage('attachment://hitler.png')
            .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
        await interaction.reply({
            embeds: [embedhitler],
            files: [attachment]
        });
    },
};