const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
let song, voice, nick, userpp;
const wait = require('util').promisify(setTimeout);
const Discord = require("discord.js");
const { SearchResult, DisTubeError } = require('distube');
const DisTube = require('distube');
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
	leaveOnStop: true
})
module.exports = {
	client, distube,
	data: new SlashCommandBuilder()
		.setName('play')
        .addStringOption(option => option.setName('songname').setRequired(true).setDescription("Gebe hier den Link zu deinem Song an!"))
		.setDescription('Spiele deine Lieblingsmusik!'),
	async execute(interaction) {
		//console.log(interaction.channelId);
			nick = interaction.member.nickname;
			userpp = interaction.user.avatarURL();
			song = interaction.options.get('songname').value;
			voice = interaction.member.voice.channel;
			messagesend = false;
			try {
				let validsong = await distube.search(song);
				//console.log(validsong);
				if (voice != null || await validsong != undefined || await validsong != null) {
					/*const embedwaiting = new MessageEmbed()
						.setColor('#0099ff')
						.setTitle(`Suche nach deinem Lied, dies kann einen Moment dauern... :smile:`);
					await interaction.reply({ embeds: [embedwaiting] });*/
					interaction.deferReply();
					distube.playVoiceChannel(voice, song);
					const buttons = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId('playpause')
							.setLabel('⏯️')
							.setStyle('SECONDARY'),
						new MessageButton()
							.setCustomId('skip')
							.setLabel('⏭️')
							.setStyle('SECONDARY'),
						new MessageButton()
							.setCustomId('stop')
							.setLabel('⏹️')
							.setStyle('SECONDARY'),
					);
					distube.on("playSong", (queue, song) => {
						desc = `🎵 ${song.name}\n⏱️  ${song.formattedDuration}`;
						if (song.playlist) { desc = `Playlist: ${song.playlist.name}\n${desc}`; }
							thumbnail = `${song.thumbnail}`;
							url = `${song.url}`;
							//console.log(`${queue.songs.length}`);
						if (queue.songs.length <= 1) {
							const embed = new MessageEmbed()
								.setColor('#0099ff')
								.setTitle(`Ich spiele nun:`)
								.setDescription(desc)
								.setURL(url)
								.setThumbnail(thumbnail)
								.setFooter(`Angefragt von ${nick}`, `${userpp}`);
							interaction.editReply({ embeds: [embed], components: [buttons] });
						}
					});
					distube.once("addSong", ( queue, song ) => {
						desc = `🎵 ${song.name}\n⏱️  ${song.formattedDuration}`
						if (song.playlist) { desc = `Playlist: ${song.playlist.name}\n${desc}` }
						thumbnail = `${song.thumbnail}`
						url = `${song.url}`;
						//console.log(`${queue.songs.length}`);
						/*if (queue.songs.length = 1) {
							const embed = new MessageEmbed()
								.setColor('#0099ff')
								.setTitle(`Ich spiele nun:`)
								.setDescription(desc)
								.setURL(url)
								.setThumbnail(thumbnail)
								.setFooter(`Angefragt von ${nick}`, `${userpp}`);
							interaction.editReply({ embeds: [embed], components: [buttons] });
							messagesend = true;
						} else*/ if (queue.songs.length > 1) {
							const embedqueue = new MessageEmbed()
								.setColor('#0099ff')
								.setTitle(`Song wurde zur Warteschlange hinzugefügt:`)
								.setDescription(desc)
								.setURL(url)
								.setThumbnail(thumbnail)
								.setFooter(`Angefragt von ${nick}`, `${userpp}`);
							interaction.editReply({ embeds: [embedqueue] });
						}
						//const collector = message.createMessageComponentCollector({ componentType: "BUTTON" });
						//collector.on("collect", interaction => {
					});
				} else {
					const embedfailedtoconnect = new MessageEmbed()
						.setColor('#0099ff')
						.setTitle(`Du befindest dich in keinem Channel :sad:`);
					await interaction.reply({ ephemeral: true, embeds: [embedfailedtoconnect] });
				}
			} catch(e) {
				const embedsearchfailed = new MessageEmbed()
					.setColor('#0099ff')
					.setTitle("Lied nicht gefunden")
					.setDescription(`Ich konnte leider kein Lied mit dem Titel **${song}** finden`)
					.setFooter(`Angefragt von ${nick}`, `${userpp}`);
				await interaction.reply({ ephemeral: true, embeds: [embedsearchfailed] });
			}
	}, nick, userpp, song, voice,
};