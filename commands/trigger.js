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
        .setName('trigger')
        .addUserOption(option => option.setName('user').setRequired(true).setDescription("Erwähne hier eine Person"))
        .setDescription('Oh da scheint wer getriggered zu sein'),
    async execute(interaction) {
        if (interaction.member.nickname != null) {
            nick = interaction.member.nickname;
        } else {
            nick = interaction.user.username;
        }
        userpp = interaction.user.avatarURL();
        mentionedUser = interaction.options.get('user').user.avatarURL({ dynamic: false, format: 'png' });
        image = await canvacord.Canvacord.trigger(mentionedUser.toString());
        let attachment = await new MessageAttachment(image, "trigger.gif");
        const embedtrigger = new MessageEmbed()
            .setColor(`${color}`)
            .setImage('attachment://trigger.gif')
            .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
        await interaction.reply({
            embeds: [embedtrigger],
            files: [attachment]
        });
    },
};