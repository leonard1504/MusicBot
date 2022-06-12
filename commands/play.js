const {
	SlashCommandBuilder
} = require('@discordjs/builders');
const {
	MessageEmbed
} = require('discord.js');
const {
	color,
	loadingemoji,
	leaveemoji
} = require("../config.json");
let song, voice, nick, userpp;
const Discord = require("discord.js");
const DisTube = require('distube');
const {
	SpotifyPlugin
} = require("@distube/spotify");
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
	youtubeCookie: "CONSENT=YES+DE.de+V14+BX; VISITOR_INFO1_LIVE=YjHek9m3hok; PREF=f4=4000000&tz=Europe.Berlin&f6=40000000; GPS=1; YSC=0mZM_LlqglQ; SID=EQiABbGu3_qXqXIB4dQPJKaOMG90V0dSXhjKIYxkT08Bh74v80IcgTFU9LaNmoQl2-ihfw.; __Secure-1PSID=EQiABbGu3_qXqXIB4dQPJKaOMG90V0dSXhjKIYxkT08Bh74vWBBPuuTRPkZbUUyL5CjtiQ.; __Secure-3PSID=EQiABbGu3_qXqXIB4dQPJKaOMG90V0dSXhjKIYxkT08Bh74vxn3TOwPiUFcmf5_UVnIpRQ.; HSID=APeer9W268oV2Fuav; SSID=AO56i7qYZoNW3zLyh; APISID=Y50pgWdVlI3QMPi8/AuLBvLUYPvbGBNE-S; SAPISID=MuJT_49p74aEcwpQ/AoyiJM7ldKChPlTZk; __Secure-1PAPISID=MuJT_49p74aEcwpQ/AoyiJM7ldKChPlTZk; __Secure-3PAPISID=MuJT_49p74aEcwpQ/AoyiJM7ldKChPlTZk; LOGIN_INFO=AFmmF2swRgIhAOUF2l1GZY0xbUUl7B7k9I-DR8VwZs3tyh05xTmfB1ZkAiEA0DLM8ITy9aiwZALR5bDD4BAytamNbFF_rUrsRN5xIjQ:QUQ3MjNmd3FJeXJpdkZfblBiNDZJMUtzTVhxbjVxNktJcWRJOTZZeWZOc085a1hIMHZ3N0h2MVNZRVQwVWtLZVB4WUd0TkJoV25oUVRMSEFWT19qYUljT0lJbU82VTE3SVJIZktjU1FjRkNlSk1zWVRQQU5OOXluTWVnQk9nZEZSaWJnVUpRNThWSUxXNHBzTkdJSHdUQWp3TEUwWmk1QUpB; SIDCC=AJi4QfEaC3V9eWRuVvYZaSjVNHu-_DrLchzssutpBYiqoI46sPkbPA7GxVbN4ktgv3FhXiK_6g; __Secure-3PSIDCC=AJi4QfFN7arscmN6V8zsqH9Vx5_SWENUERLuCSmNK2QriTIWQ6PLmBhTMTkAR6IOj1OXc6E",
	nsfw: true,
	plugins: [spotifyplugin],
})

module.exports = {
	client,
	distube,
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
		interaction.reply({
			embeds: [embedwaiting]
		});
		voice = await interaction.member.voice.channel;
		if (voice != null) {
			distube.play(voice, song, {
				member: interaction.member,
				textChannel: interaction.channel
			});

			distube.once("addSong", (queue, song) => {
				interaction.deleteReply();
			});

			distube.on("addList", (queue, song) => {
				interaction.deleteReply();
			});

			distube.on('error', async (channel, error) => {
				interaction.deleteReply();
				console.log(error);
				const embedsearchfailed = new MessageEmbed()
					.setColor(`${color}`)
					.setTitle("Lied nicht gefunden")
					.setDescription(`${leaveemoji} Ich konnte leider kein Lied mit dem Titel / über den Link **${song}** finden.`)
					.setFooter(`Ausgeführt von: ${nick}`, `${userpp}`);
				await interaction.channel.send({
					ephemeral: true,
					embeds: [embedsearchfailed]
				});
			});

		} else {
			interaction.deleteReply();
			const embedfailedtoconnect = new MessageEmbed()
				.setColor(`${color}`)
				.setTitle(`${leaveemoji} Du befindest dich in keinem Channel`)
				.setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
			await interaction.channel.send({
				ephemeral: true,
				embeds: [embedfailedtoconnect]
			});
		}
	},
};