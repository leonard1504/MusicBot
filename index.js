const Discord = require("discord.js");
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const DisTube = require('distube');
const fs = require("fs");
const { token } = require("./config.json");
const { distube, client, nick, userpp, messagesend } = require('./commands/play');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Bot Ready!');
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	//console.log(interaction);
	const command = client.commands.get(interaction.commandName);

	if (!command) return;
	try {
		await command.execute(interaction);
	} catch (error) {
		console.log(error);
		return interaction.reply({ content: 'Oh Tut mir leid, da ist wohl was schiefgelaufen :/ ' + error, ephemeral: true });
	}
});

client.on('interactionCreate', interaction => {
	if (!interaction.isButton()) return;
	nick2 = interaction.member.nickname;
	userpp2 = interaction.user.avatarURL();
	queue = distube.getQueue(interaction.guildId);
	if(queue != undefined) {
		if (queue.songs.length !== 0 || queue.songs) {
			switch (interaction.customId) {
				case "stop":
					console.log(interaction.customId);
					if(queue.playing) {
						distube.stop(interaction.guildId);
						const embedstop = new MessageEmbed()
						.setColor('#0099ff')
						.setTitle(`Song wird gestopppt ⏹`)
						.setFooter(`Gestoppt von ${nick2}`, `${userpp2}`);
					interaction.reply({ embeds: [embedstop] });
					} else {
						const embedstopfailed = new MessageEmbed()
						.setColor('#0099ff')
						.setTitle(`Song konnte wurde bereits gestoppt ⏹️`)
						.setFooter(`${nick2} hat probiert das gestoppte Lied zu stoppen`, `${userpp2}`);
						interaction.reply({ ephemeral: true, embeds: [embedstopfailed] });
					}
				break;
				case "skip":
					console.log(interaction.customId);
					if (queue.next) {
						distube.skip(interaction.guildId);
						const embedskipped = new MessageEmbed()
						.setColor('#0099ff')
						.setTitle(`Song wurde geskipped ⏭️`)
						.setFooter(`Lied wurde von ${nick2} geskipped`, `${userpp2}`);
						interaction.reply({ embeds: [embedskipped] });
					} else {
						const embedskippedfailed = new MessageEmbed()
						.setColor('#0099ff')
						.setTitle(`Song konnte nicht geskipped werden, da kein weiterer Song in der Warteschlange ist ⏭️`)
						.setFooter(`${nick2} wollte das Lied skippen`, `${userpp2}`);
						interaction.reply({ ephemeral: true, epherembeds: [embedskippedfailed] });
					}
				break;
				case "playpause":
					console.log(interaction.customId);
					if(queue.playing) {
						distube.pause(interaction.guildId);
						const embedpause = new MessageEmbed()
						.setColor('#0099ff')
						.setTitle(`Song wird angehalten ⏸️`)
						.setFooter(`Angehalten von ${nick2}`, `${userpp2}`);
						interaction.reply({ embeds: [embedpause] });
					} else {
						distube.resume(interaction.guildId);
						const embedplay = new MessageEmbed()
						.setColor('#0099ff')
						.setTitle(`Song wird abgespielt ▶️`)
						.setFooter(`Lied wird weiter abgespielt von ${nick2}`, `${userpp2}`);
						interaction.reply({ embeds: [embedplay] });
					} 
				break;
			}
		}
	} else {
		const embednoqueue = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle(`Du kannst dies nicht tun, da kein Lied läuft :thinking:`)
			.setFooter(`${nick2} wollte Kommandos nutzen obwohl nichts läuft schon n bissl Cringe`, `${userpp2}`);
		interaction.reply({ ephemeral: true, embeds: [embednoqueue] });
	}
});

client.login(token);