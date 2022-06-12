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
        .setName('delete')
        .addUserOption(option => option.setName('user').setRequired(true).setDescription("Erwähne hier eine Person"))
        .setDescription('Delete this shit'),
    async execute(interaction) {
        if (interaction.member.nickname != null) {
            nick = interaction.member.nickname;
        } else {
            nick = interaction.user.username;
        }
        userpp = interaction.user.avatarURL();
        mentionedUser = interaction.options.get('user').user.avatarURL({ dynamic: false, format: 'png' });
        image = await canvacord.Canvacord.delete(mentionedUser.toString());
        let attachment = await new MessageAttachment(image, "delete.png");
        const embeddelete = new MessageEmbed()
            .setColor(`${color}`)
            .setImage('attachment://delete.png')
            .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
        await interaction.reply({
            embeds: [embeddelete],
            files: [attachment]
        });
    },
};