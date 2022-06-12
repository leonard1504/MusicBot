const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    color,
    leaveemoji
} = require("../config.json");
const {
    MessageEmbed
} = require('discord.js');
const delay = ms => new Promise(res => setTimeout(res, ms));
module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDefaultPermission(false)
        .addIntegerOption(option => option.setName('anzahl').setRequired(true).setDescription("Gib hier die Anzahl an zu löschenen Nachrichten an"))
        .setDescription('Löscht Nachrichten im aktuellen Channel'),
    async execute(interaction) {
        if (interaction.member.nickname != null) {
            nick = interaction.member.nickname;
        } else {
            nick = interaction.user.username;
        }
        userpp = interaction.user.avatarURL();
        console.log(interaction);
        const messages = await interaction.channel.messages.fetch({limit: interaction.options.get('anzahl').value});
        const {size} = messages;
        messages.forEach((messages) => messages.delete());
        const embedaffect = new MessageEmbed()
            .setColor(`${color}`)
            .setDescription(`${leaveemoji} Ich habe ${size>1 ? `${size} Nachrichten gelöscht` : `${size} Nachricht gelöscht`}`)
            .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
        await interaction.reply({
            embeds: [embedaffect],
        })
        await delay(3000);
        await interaction.deleteReply();
    }
}
