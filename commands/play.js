const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { color, loadingemoji } = require("../config.json");
let song, voice, nick, userpp;
const Discord = require("discord.js");
const DisTube = require('distube');
const { SpotifyPlugin } = require("@distube/spotify");
const client = new Discord.Client({
	intents: [
		'GUILDS',
		'GUILD_VOICE_STATES',
		'GUILD_MESSAGES',
		'GUILD_MEMBERS',
		'GUILD_BANS',
		'GUILD_INVITES',
		'GUILD_WEBHOOKS',
		'GUILD_PRESENCES',
	],
});
const distube = new DisTube.default(client, {
	searchSongs: 1,
	searchCooldown: 5,
	leaveOnEmpty: true,
	emptyCooldown: 0,
	leaveOnFinish: true,
	leaveOnStop: true,
	youtubeCookie: "",
	nsfw: true,
	plugins: [new SpotifyPlugin({api: {clientId: "c669d4c118d348c9aba24145893c74f9", clientSecret: "f5c9af6998454887906acd95c8ce7a84"}})],
})

module.exports = {
	client, distube,
	data: new SlashCommandBuilder()
		.setName('play')
        .addStringOption(option => option.setName('songname').setRequired(true).setDescription("Gebe hier entweder den Link zum Song / Playlist oder einfach den Liedtitel!"))
		.setDescription('Spiele deine Lieblingsmusik! Gib einfach dein Link oder Liedtitel ein'),
	async execute(interaction) {
			if (interaction.member.nickname != null) {
				nick = interaction.member.nickname;
			} else {
				nick = interaction.user.username;
			}
			userpp = interaction.user.avatarURL();
			song = interaction.options.get('songname').value;
			try {
				const embedwaiting = new MessageEmbed()
					.setColor(`${color}`)
					.setTitle(`${loadingemoji} Suche nach deinem Lied, dies kann einen Moment dauern... :smile:`)
					.setDescription(`Manche Lieder können manchmal bedingt durch YouTube Richtlinen nicht auf Anhieb wiedergegeben werden, probier dies dann einfach nochmal :smile:`)
					.setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
				interaction.reply({ embeds: [embedwaiting] });
				let validsong = await distube.search(song);
				voice = await interaction.member.voice.channel;
				if ( voice != null && validsong.length != 0) {
					distube.playVoiceChannel(voice, song, { member: interaction.member, textChannel: interaction.channel });
					
					distube.once("addSong", ( queue, song ) => {
						interaction.deleteReply();	
					});

					distube.on("addList", ( queue, song ) => {
						interaction.deleteReply();
					});

				} else {
					interaction.deleteReply();
					const embedfailedtoconnect = new MessageEmbed()
						.setColor(`${color}`)
						.setTitle(`Du befindest dich in keinem Channel 😢`)
						.setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
					await interaction.channel.send({ ephemeral: true, embeds: [embedfailedtoconnect] });
				}
			} catch(e) {
				console.log(e);
				interaction.deleteReply();
				const embedsearchfailed = new MessageEmbed()
					.setColor(`${color}`)
					.setTitle("Lied nicht gefunden")
					.setDescription(`Ich konnte leider kein Lied mit dem Titel / über den Link **${song}** finden :cry:`)
					.setFooter(`Ausgeführt von: ${nick}`, `${userpp}`);
				await interaction.channel.send({ ephemeral: true, embeds: [embedsearchfailed] });
			}
	},
};