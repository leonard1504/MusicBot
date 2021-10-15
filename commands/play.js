const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { musicemoji, stopwatchemoji, color } = require("../config.json");
let song, voice, nick, userpp;
const Discord = require("discord.js");
const DisTube = require('distube');
const { SpotifyPlugin } = require("@distube/spotify");
const { validateAudioURL } = require('distube');
const client = new Discord.Client({
	intents: [
		'GUILDS',
		'GUILD_VOICE_STATES',
		'GUILD_MESSAGES',
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
	plugins: [new SpotifyPlugin({api: {clientId: "c669d4c118d348c9aba24145893c74f9", clientSecret: "f5c9af6998454887906acd95c8ce7a84",},})],
})

module.exports = {
	client, distube,
	data: new SlashCommandBuilder()
		.setName('play')
        .addStringOption(option => option.setName('songname').setRequired(true).setDescription("Gebe hier entweder den Link zum Song / Playlist oder einfach den Liedtitel!"))
		.setDescription('Spiele deine Lieblingsmusik! Gib einfach dein Link oder Liedtitel ein :smile:'),
	async execute(interaction) {
			nick = interaction.member.nickname;
			userpp = interaction.user.avatarURL();
			song = interaction.options.get('songname').value;
			try {
				const embedwaiting = new MessageEmbed()
					.setColor(`${color}`)
					.setTitle(`Suche nach deinem Lied, dies kann einen Moment dauern... :smile:`)
					.setFooter(`💥 Ausgeführt von:  ${nick}`, `${userpp}`);
				await interaction.reply({ embeds: [embedwaiting] });
				let validsong = await distube.search(song);
				voice = await interaction.member.voice.channel;
				if ( voice != null && validsong.length != 0) {
					distube.playVoiceChannel(voice, song, { member: interaction.member, textChannel: interaction.channel });
					
					distube.once("addSong", ( queue, song ) => {
						desc = `${musicemoji} ${song.name}\n${stopwatchemoji} ${song.formattedDuration}`
						if (song.playlist) { desc = `Playlist: ${song.playlist.name}\n\n${desc}` }
						thumbnail = `${song.thumbnail}`
						url = `${song.url}`;
						if (queue.songs.length === 1 && queue.playing) {
							interaction.deleteReply();
						} else if (queue.songs.length > 1) {
							const embedqueue = new MessageEmbed()
								.setColor(`${color}`)
								.setTitle(`Song wurde zur Warteschlange hinzugefügt:`)
								.setDescription(desc)
								.setURL(url)
								.setThumbnail(thumbnail)
								.setFooter(`💥 Ausgeführt von:  ${nick}`, `${userpp}`);
							interaction.editReply({  ephemeral: false, embeds: [embedqueue] });
						}
					});
				} else {
					const embedfailedtoconnect = new MessageEmbed()
						.setColor(`${color}`)
						.setTitle(`Du befindest dich in keinem Channel 😢`)
						.setFooter(`💥 Ausgeführt von:  ${nick}`, `${userpp}`);
					await interaction.editReply({ ephemeral: true, embeds: [embedfailedtoconnect] });
				}
			} catch(e) {
				console.log(e);
				const embedsearchfailed = new MessageEmbed()
					.setColor(`${color}`)
					.setTitle("Lied nicht gefunden")
					.setDescription(`Ich konnte leider kein Lied mit dem Titel / über den Link **${song}** finden :cry:`)
					.setFooter(`💥 Ausgeführt von: ${nick}`, `${userpp}`);
				await interaction.editReply({ ephemeral: true, embeds: [embedsearchfailed] });
			}
	},
};