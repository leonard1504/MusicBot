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
        .setName('pornhub')
        .addUserOption(option => option.setName('user').setRequired(true).setDescription("Erwähne hier eine Person"))
        .addStringOption(option => option.setName('name').setRequired(true).setDescription("Gib hier den Namen der Person an"))
        .addStringOption(option => option.setName('text').setRequired(true).setDescription("Schreib hier was die Person auf PornHub sagen soll"))
        .setDescription('Ahja da chillt wer auf PornHub'),
    async execute(interaction) {
        if (interaction.member.nickname != null) {
            nick = interaction.member.nickname;
        } else {
            nick = interaction.user.username;
        }
        userpp = interaction.user.avatarURL();
        mentionedUser = interaction.options.get('user').user.avatarURL({ dynamic: false, format: 'png' });
        image = await canvacord.Canvacord.phub(options = {username: interaction.options.get('name').value.toString(), message: interaction.options.get('text').value.toString(), image: mentionedUser.toString()});
        let attachment = await new MessageAttachment(image, "pornhub.png");
        const embedpornhub = new MessageEmbed()
            .setColor(`${color}`)
            .setImage('attachment://pornhub.png')
            .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
        await interaction.reply({
            embeds: [embedpornhub],
            files: [attachment]
        });
    },
};