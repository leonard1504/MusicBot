const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    MessageEmbed
} = require('discord.js');
const {
    color,
    token,
    leaveemoji
} = require('../config.json');
const {
	client
} = require('./play');
const DiscordGame = require('discord-games-beta');
const game = new DiscordGame(token, 'youtube', 10, {neverExpire: false});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('youtube')
        .setDescription('Erstellt in deinem jetzigen Voice-Channel ein YouTube Together Raum'),
    async execute(interaction) {
        if (interaction.member.nickname != null) {
            nick = interaction.member.nickname;
        } else {
            nick = interaction.user.username;
        }
        userpp = interaction.user.avatarURL();
        const guild = client.guilds.cache.get("292007278205206530");
        const member = guild.members.cache.get(interaction.member.user.id);
        const voiceChannel = member.voice.channel;
        if(voiceChannel !== null) {
            const embedyoutube = new MessageEmbed()
            .setTitle("YouTube Together")
            .setColor(`${color}`)
            .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/YouTube_Logo_2017.svg/320px-YouTube_Logo_2017.svg.png")
            .setDescription("Klicke den folgenden Link um am YouTube Together Event teilzunehmen\n\n**Anleitung**\n Der Nutzer der das Watch Together starten will klickt den vom Bot gesendeten Link an, darauf hin werden die untenliegenden Knöpfe aktiviert und die andere Nutzer können beitreten.")
            .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
            await interaction.reply({
                embeds: [embedyoutube]
            });
            game.play(voiceChannel).then(result => interaction.channel.send(result.inviteLink));
        } else {
            const embedyoutubefailed = new MessageEmbed()
            .setTitle("YouTube Together")
            .setColor(`${color}`)
            .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/YouTube_Logo_2017.svg/320px-YouTube_Logo_2017.svg.png")
            .setDescription(`${leaveemoji} Du befindest dich in keinem Voice-Channel`)
            .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
        await interaction.reply({
            embeds: [embedyoutubefailed], ephemeral: true
            });
        }  
    },
};