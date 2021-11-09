const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { color, loadingemoji, leaveemoji } = require("../config.json");
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
const spotifyplugin = new SpotifyPlugin({
	parallel: true, 
	emitEventsAfterFetching: true, 
	api: {
		clientId: "c669d4c118d348c9aba24145893c74f9", 
		clientSecret: "f5c9af6998454887906acd95c8ce7a84",
	},
});

const distube = new DisTube.default(client, {
	searchSongs: 0,
	searchCooldown: 5,
	leaveOnEmpty: true,
	emitNewSongOnly: true,
	leaveOnFinish: true,
	leaveOnStop: true,
	updateYouTubeDL: false,
	youtubeCookie: "CONSENT=YES+DE.de+V14+BX; GPS=1; YSC=xS9CyljtGNE; VISITOR_INFO1_LIVE=YjHek9m3hok; CONSISTENCY=AGDxDeNJfmDTHPuyPFHsmcb3dP2E67KbDwDT8TD6A6Cd0u2krAnqX9-XJ2S-2f60RW6jpA05zowDnIDEA0ltBL77jlFWEpIzjyn9CWvnv7289vN5M6d435P_gNTuf5IpHkoU_5D87ozIOn3cOBtUNg; PREF=f4=4000000&tz=Europe.Berlin&f6=40000000",
	nsfw: true,
	plugins: [spotifyplugin],
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
			const embedwaiting = new MessageEmbed()
				.setColor(`${color}`)
				.setTitle(`${loadingemoji} Suche nach deinem Lied, dies kann einen Moment dauern...`)
				.setDescription(`Manche Lieder können manchmal bedingt durch YouTube Richtlinen nicht auf Anhieb wiedergegeben werden, probier dies dann einfach nochmal.`)
				.setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
			interaction.reply({ embeds: [embedwaiting] });
			voice = await interaction.member.voice.channel;
			if ( voice != null) {
				distube.playVoiceChannel(voice, song, { member: interaction.member, textChannel: interaction.channel });
				
				distube.once("addSong", ( queue, song ) => {
					interaction.deleteReply();	
				});

				distube.on("addList", ( queue, song ) => {
					interaction.deleteReply();
				});

				distube.on('error', async (channel, error) => {
					interaction.deleteReply();
					const embedsearchfailed = new MessageEmbed()
						.setColor(`${color}`)
						.setTitle("Lied nicht gefunden")
						.setDescription(`${leaveemoji} Ich konnte leider kein Lied mit dem Titel / über den Link **${song}** finden.`)
						.setFooter(`Ausgeführt von: ${nick}`, `${userpp}`);
					await interaction.channel.send({ ephemeral: true, embeds: [embedsearchfailed] });
				});
				
			} else {
				interaction.deleteReply();
				const embedfailedtoconnect = new MessageEmbed()
					.setColor(`${color}`)
					.setTitle(`${leaveemoji} Du befindest dich in keinem Channel`)
					.setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
				await interaction.channel.send({ ephemeral: true, embeds: [embedfailedtoconnect] });
			}
	},
};