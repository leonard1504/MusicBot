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
        .setName('pixelate')
        .addUserOption(option => option.setName('user').setRequired(true).setDescription("Erwähne hier eine Person"))
        .setDescription('Die Person wird verpixelt'),
    async execute(interaction) {
        if (interaction.member.nickname != null) {
            nick = interaction.member.nickname;
        } else {
            nick = interaction.user.username;
        }
        userpp = interaction.user.avatarURL();
        mentionedUser = interaction.options.get('user').user.avatarURL({ dynamic: false, format: 'png' });
        image = await canvacord.Canvacord.pixelate(mentionedUser.toString());
        let attachment = await new MessageAttachment(image, "pixelate.png");
        const embedpixelate = new MessageEmbed()
            .setColor(`${color}`)
            .setImage('attachment://pixelate.png')
            .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
        await interaction.reply({
            embeds: [embedpixelate],
            files: [attachment]
        });
    },
};