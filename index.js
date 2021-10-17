const Discord = require("discord.js");
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const DisTube = require('distube');
const fs = require("fs");
const { token, playemoji, skipemoji, playpauseemoji, pauseemoji, queueemoji, queuesongemoji, musicemoji, stopwatchemoji, color, listemoji, leaveemoji } = require("./config.json");
const { distube, client } = require('./commands/play');
const { error } = require("console");
const { EventEmitter } = require("stream");
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Bot Ready!');
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setPresence({status: "dnd", activities: [{name: "momentan nichts..."}]});
	distube.setMaxListeners(10);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);

	if (!command) return;
	try {
		await command.execute(interaction);
	} catch (error) {
		console.log(error);
		return interaction.editReply({ content: 'Oh Tut mir leid, da ist wohl was schiefgelaufen :/ ' + error, ephemeral: true });
	}
});

client.on('interactionCreate', interaction => {
	if (!interaction.isButton()) return;
	if (interaction.member.nickname != null) {
		nick2 = interaction.member.nickname;
	} else {
		nick2 = interaction.user.username;
	}
	userpp2 = interaction.user.avatarURL();
	queue = distube.getQueue(interaction.guildId);
	if(queue != undefined) {
		if (queue.songs.length !== 0 || queue.songs) {
			switch (interaction.customId) {
				case "stop":
					console.log(interaction.customId);
					if(queue.playing) {
						client.user.setPresence({status: "dnd", activities: [{name: "momentan nichts..."}]});
						distube.stop(interaction.guildId);
						const embedstop = new MessageEmbed()
							.setColor(`${color}`)
							.setTitle(`Ich gehe ja schon :cry: 🚪`)
							.setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
						interaction.reply({ embeds: [embedstop] });
					} else {
						const embedstopfailed = new MessageEmbed()
							.setColor(`${color}`)
							.setTitle(`Ich spiele doch schon nicht mehr :cry:`)
							.setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
						interaction.reply({ ephemeral: true, embeds: [embedstopfailed] });
					}
				break;
				case "skip":
					console.log(interaction.customId);
					if (queue.songs.length > 1) {
						distube.skip(interaction.guildId);
						const embedskipped = new MessageEmbed()
							.setColor(`${color}`)
							.setTitle(`Song wurde geskipped ${skipemoji}`)
							.setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
						interaction.reply({ embeds: [embedskipped] });
					} else {
						const embedskippedfailed = new MessageEmbed()
							.setColor(`${color}`)
							.setTitle(`Song konnte nicht geskipped werden, da kein weiterer Song in der Warteschlange ist ${skipemoji}`)
							.setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
						interaction.reply({ ephemeral: true, embeds: [embedskippedfailed] });
					}
					let skipped = true;
				break;
				case "playpause":
					console.log(interaction.customId);
					if(queue.playing) {
						distube.pause(interaction.guildId);
						const embedpause = new MessageEmbed()
						.setColor(`${color}`)
						.setTitle(`Song wird angehalten ${pauseemoji}`)
						.setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
						interaction.reply({ embeds: [embedpause] });
					} else {
						distube.resume(interaction.guildId);
						const embedplay = new MessageEmbed()
						.setColor(`${color}`)
						.setTitle(`Song wird abgespielt ${playemoji}`)
						.setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
						interaction.reply({ embeds: [embedplay] });
					} 
				break;
				case "repeatsong":
					console.log(interaction.customId);
					if(queue.repeatMode === 0 || queue.repeatMode === 2) {
						distube.setRepeatMode(interaction.guild, 1);
						const embedrepeatsong = new MessageEmbed()
							.setColor(`${color}`)
							.setTitle(`Song wird wiederholt ${queuesongemoji}`)
							.setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
						interaction.reply({ embeds: [embedrepeatsong] });
					} else if (queue.repeatMode === 1) {
						distube.setRepeatMode(interaction.guild, 0);
						const embedrepeatsongstop = new MessageEmbed()
							.setColor(`${color}`)
							.setTitle(`Song wird nicht mehr wiederholt ${queuesongemoji}`)
							.setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
						interaction.reply({ embeds: [embedrepeatsongstop] });
					} 
				break;
				case "repeatqueue":
					console.log(interaction.customId);
					if(queue.repeatMode === 0 || queue.repeatMode === 1) {
						distube.setRepeatMode(interaction.guild, 2);
						const embedrepeatsong = new MessageEmbed()
							.setColor(`${color}`)
							.setTitle(`Warteschlange wird wiederholt ${queueemoji}`)
							.setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
						interaction.reply({ embeds: [embedrepeatsong] });
					} else if (queue.repeatMode === 2) {
						distube.setRepeatMode(interaction.guild, 0);
						const embedrepeatsongstop = new MessageEmbed()
							.setColor(`${color}`)
							.setTitle(`Warteschlange wird nicht mehr wiederholt ${queueemoji}`)
							.setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
						interaction.reply({ embeds: [embedrepeatsongstop] });
					} 
				break;
			}
		}
	} else {
		const embednoqueue = new MessageEmbed()
			.setColor(`${color}`)
			.setTitle(`Du kannst dies nicht tun, da kein Lied läuft :thinking:`)
			.setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
		interaction.reply({ ephemeral: true, embeds: [embednoqueue] });
	}
});

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

client.on('interactionCreate', interaction => {
	if (!interaction.isSelectMenu()) return;
	if (interaction.member.nickname != null) {
		nick2 = interaction.member.nickname;
	} else {
		nick2 = interaction.user.username;
	}
	userpp2 = interaction.user.avatarURL();
	queue = distube.getQueue(interaction.guildId);
	if(queue != undefined) {
		if (queue.songs.length !== 0 || queue.songs) {
			let setfilter = interaction.values;
			console.log(setfilter);
			if(queue.playing && setfilter != "false") {
				distube.setFilter(queue, `${setfilter}`);
				const filtertext = capitalizeFirstLetter(setfilter.toString());
				const embedfilterapply = new MessageEmbed()
					.setColor(`${color}`)
					.setTitle(`Okay ich habe ${filtertext} als Effekt angewendet`)
					.setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
				interaction.reply({ embeds: [embedfilterapply] });
			} else {
				distube.setFilter(queue, false);
				const embedfilterstop = new MessageEmbed()
					.setColor(`${color}`)
					.setTitle(`Okay ich habe alle Filter deaktiviert`)
					.setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
				interaction.reply({ embeds: [embedfilterstop] });
			}
		}
	} else {
		const embednoqueue = new MessageEmbed()
			.setColor(`${color}`)
			.setTitle(`Du kannst dies nicht tun, da kein Lied läuft :thinking:`)
			.setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
		interaction.reply({ ephemeral: true, embeds: [embednoqueue] });
	}
});

const buttons = new MessageActionRow()
.addComponents(
	new MessageButton()
		.setCustomId('playpause')
		.setEmoji(`${playpauseemoji}`)
		.setStyle('SECONDARY'),
	new MessageButton()
		.setCustomId('skip')
		.setEmoji(`${skipemoji}`)
		.setStyle('SECONDARY'),
	new MessageButton()
		.setCustomId('repeatsong')
		.setEmoji(`${queuesongemoji}`)
		.setStyle('SECONDARY'),
	new MessageButton()
		.setCustomId('repeatqueue')
		.setEmoji(`${queueemoji}`)
		.setStyle('SECONDARY'),
	new MessageButton()
		.setCustomId('stop')
		.setLabel(`${leaveemoji}`)
		.setStyle('DANGER'),
);

distube.on("addList", ( queue, song ) => {
	desc = `${musicemoji} ${song.name}\n${stopwatchemoji} ${song.formattedDuration}\n\n${listemoji} Noch ${queue.songs.length} Lied(er) in der Warteschlange`;
	thumbnail = `${song.thumbnail}`
	url = `${song.url}`;
	if (song.member.nickname != null) {
		nick = song.member.nickname;
	} else {
		nick = song.user.username;
	}
	const embedqueueadd = new MessageEmbed()
		.setColor(`${color}`)
		.setTitle(`Playlist wurde zur Warteschlange hinzugefügt:`)
		.setDescription(desc)
		.setURL(url)
		.setThumbnail(thumbnail)
		.setFooter(`Ausgeführt von:  ${nick}`, `${song.user.avatarURL()}`);
	queue.textChannel.send({ embeds: [embedqueueadd] });
});

distube.on("playSong", (queue, song) => {
	desc = `${musicemoji} ${song.name}\n${stopwatchemoji} ${song.formattedDuration}\n\n${listemoji} Noch ${queue.songs.length} Lied(er) in der Warteschlange`;
	if (song.playlist) { desc = `Playlist: ${song.playlist.name}\n\n${desc}`; }
		thumbnail = `${song.thumbnail}`;
		url = `${song.url}`;
		if (song.member.nickname != null) {
			nick = song.member.nickname;
		} else {
			nick = song.user.username;
		}
	if (queue.songs.length >= 1 && queue) {
		client.user.setPresence({status: "online", activities: [{name: `${song.name}`, type: "PLAYING", url: `${song.url}`}]});
		const embed = new MessageEmbed()
			.setColor(`${color}`)
			.setTitle(`Ich spiele nun:`)
			.setDescription(desc)
			.setURL(url)
			.setThumbnail(thumbnail)
			.setFooter(`Ausgeführt von: ${nick}`, `${song.user.avatarURL()}`);
		queue.textChannel.send({  ephemeral: false, embeds: [embed], components: [buttons] });
	}
});

distube.on("finishSong", (queue, song) => {
	client.user.setPresence({status: "dnd", activities: [{name: "momentan nichts..."}]});
});

distube.on("empty", (queue, song) => {
	client.user.setPresence({status: "dnd", activities: [{name: "momentan nichts..."}]});
});

distube.on("disconnect", (queue, song) => {
	client.user.setPresence({status: "dnd", activities: [{name: "momentan nichts..."}]});
});

distube.on("error", (textChannel, error) => {
	console.log(error);
});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection: (but tbh who tf cares because it works as intended)', error);
});

client.login(token);