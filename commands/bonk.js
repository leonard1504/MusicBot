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
const Canvas = require('canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bonk')
        .addUserOption(option => option.setName('user').setRequired(true).setDescription("Erwähne hier eine Person"))
        .setDescription('Hopp hopp in den horny jail'),
    async execute(interaction) {
        if (interaction.member.nickname != null) {
            nick = interaction.member.nickname;
        } else {
            nick = interaction.user.username;
        }
        userpp = interaction.user.avatarURL();
        mentionedUser = interaction.options.get('user').user.avatarURL({ dynamic: false, format: 'png' });
        const canvas = Canvas.createCanvas(1200, 672);
        const context = canvas.getContext('2d');
        const hornyjail = await Canvas.loadImage('./hornyjail.png');
        const avatar = await Canvas.loadImage(mentionedUser);
        context.drawImage(avatar, 750, 350, 300, 300);
        context.drawImage(hornyjail, 0, 0, canvas.width, canvas.height);
        const attachment = new MessageAttachment(canvas.toBuffer(), 'bonk.png');
        const embedbonk = new MessageEmbed()
            .setColor(`${color}`)
            .setImage('attachment://bonk.png')
            .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
        await interaction.reply({
            embeds: [embedbonk],
            files: [attachment]
        });
    },
};