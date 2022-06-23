const Discord = require("discord.js");
const {
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	MessageAttachment
} = require('discord.js');
const Canvas = require('canvas');
const fs = require("fs");
const path = require('path');
const {
	token,
	playemoji,
	skipemoji,
	playpauseemoji,
	pauseemoji,
	queueemoji,
	queuesongemoji,
	musicemoji,
	stopwatchemoji,
	color,
	listemoji,
	leaveemoji
} = require("./config.json");
const {
	distube,
	client
} = require('./commands/play');
const DiscordGame = require('discord-games-beta');
const fetch = require('cross-fetch');
const http = require('https');
const TempChannels = require("discord-temp-channels");
const tempChannels = new TempChannels(client);
let userdatabase = [];

function moveUser() {
    for(let i = 0; userdatabase.length > i; i++) {
        const Guild = client.guilds.cache.get("292007278205206530");
        const Member = Guild.members.cache.get(userdatabase[i].user_id);
        if(Member.voice.channel && userdatabase[i].on) {
            if(Member.voice.channelId != userdatabase[i].channel_id) {
                Member.voice.setChannel(userdatabase[i].channel_id);
                console.log("User was moved");
            }
        } else {
            movemeback = {
                user_id: userdatabase[i].user_id,
                channel_id: userdatabase[i].channel_id,
                channel_name: userdatabase[i].channel_name,
                on: false
            }
            userdatabase.push(movemeback);
            const data = JSON.stringify(userdatabase);
            fs.writeFile(`movemeback.json`, data, (err) => {
                if (err) {
                    throw err;
                }
                console.log("User disconnected toggle auto-move off");
            });
        }
    }
}

tempChannels.registerChannel("910128976968695829", {
    childCategory: "910129453445824582",
    childAutoDeleteIfEmpty: true,
	childBitrate: 128000,
    childFormat: (member, count) => `⏳ | ${member.nickname ? `${member.nickname}` : `${member.user.username}`}'s Channel`
});

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const invites = new Map();
const wait = require("timers/promises").setTimeout;
let queuedata;

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.on('ready', async () => {
	await wait(1000);
	console.log('Bot Ready!');
	console.log(`Logged in as ${client.user.tag}!`);

	client.user.setPresence({
		status: "dnd",
		activities: [{
			name: "momentan nichts..."
		}]
	});
	distube.setMaxListeners(10);
});

client.on('ready', async () => {
	setInterval(() => {
		client.guilds.cache.forEach(async (guild) => {
			const firstInvites = await guild.invites.fetch();
			invites.set(guild.id, new Map(firstInvites.map((invite) => [invite.code, invite.uses])));
		});
	}, 2500);

	setInterval(() => {
		//Read database
		fs.access('movemeback.json', (err) => {
			if(!err) {
				let file = fs.statSync('movemeback.json');
				if(file.size > 0) {
					fs.readFile('movemeback.json', 'utf-8', (err, data1) => {
						if(!err) {
							userdatabase = JSON.parse(data1.toString());
							moveUser();
						}
					});
				}
			}
		});
	}, 1000);
  
	let channel = client.channels.cache.find(channel => channel.name === "🎮gamedeals");
	setInterval(() => {
	channel.messages.fetch({ limit: 1 }).then(async messages => {
		let lastMessage = messages.first();
		let newestPost = {};
		let gamedealsPost = await fetch("https://www.reddit.com/r/FreeGameFindings/new.json").then((resp) => resp.json()).then(body => {
		let post = body.data.children[0].data;
		newestPost = {
			title: post.title,
            desc: `${post.selftext ? `${post.selftext.replaceAll("&amp;nbsp;", "").replaceAll("&amp;#x200B;","").replaceAll("&lt;", "<").replaceAll("&gt;", "").replaceAll("&amp;", "&")}` : ""}`,
			url: post.url,
			author: post.author,
			thumbnail: post.thumbnail,
			status: post.link_flair_text
		}
		});
		if(newestPost.status !== 'Expired' && lastMessage.embeds[0].title !== newestPost.title) {
		const embedgamedeals = new MessageEmbed()
		.setColor(`${color}`)
		.setTitle(`${newestPost.title}`)
        .setDescription(`${newestPost.desc}`)
		.setImage(`${newestPost.thumbnail !== 'self' ? `${newestPost.thumbnail}` : `${client.guilds.cache.get("292007278205206530").iconURL()}`}`)
		.setURL(`${newestPost.url}`)
		.setFooter(`Gepostet auf r/FreeGameFindings von ${newestPost.author}`, `${client.guilds.cache.get("292007278205206530").iconURL()}`);
		channel.send({
			embeds: [embedgamedeals]
		});
		}
	}).catch(console.error);
	}, 30000);
	
	let channel2 = client.channels.cache.find(channel => channel.name === "🌐leagueofreddit");
	setInterval(() => {
		let audio, video, url, fileSize, videoDesc, file, videoDuplicate;
		channel2.messages.fetch({ limit: 1 }).then(async messages => {
			let lastMessage = messages.first();
			let newestPost = {};
            let redditPics = [];
            const redditPicRegex = /(https?:\/\/preview.redd.it\/[^ ]*)/;
			await fetch("https://www.reddit.com/r/leagueoflegends/new.json").then((resp) => resp.json()).then(body => {
				let post = body.data.children[0].data;
				let permalink = post.permalink;
				if(post.selftext.match(redditPicRegex)) {
					for(let i = 0; i < post.selftext.match(redditPicRegex).length-1; i++) {
						redditPics.push(post.selftext.match(redditPicRegex)[i].toString().replaceAll("&amp;", "&").replaceAll("\n", ""));
					}
				}
				try {
					video = post.media.reddit_video.fallback_url.split("?")[0].split("DASH_")[0].toString() + 'DASH_480.mp4';
				} catch {
					video = null;
				}
				try {
					audio = post.media.reddit_video.fallback_url.split("?")[0].split("DASH_")[0].toString() + 'DASH_audio.mp4';
				} catch {
					audio = null;
				}
				if(video !== null) {
					if(video === lastMessage.content || lastMessage.attachments.size !== 0 && `${post.id}.mp4` === lastMessage.attachments.toJSON()[0].name) {
						videoDuplicate = true;
					} else {
						videoDuplicate = false;
					}
					if(audio !== null) {
						url = `https://redditvideodownloader.com/dl.php?permalink=https://reddit.com${permalink}&video_url=${video}&audio_url=${audio}`;
					} else {
						url = `https://redditvideodownloader.com/dl.php?permalink=https://reddit.com${permalink}&video_url=${video}`;
					}
					filePath = `./reddit_vids/${post.id}.mp4`;
					if(videoDuplicate === false) {
						file = fs.createWriteStream(filePath);
						http.get(url, (response) => {
							response.pipe(file);
						});
					} else {
            			filePath = null;
          			}
				} else {
					filePath = null;
				}
                let replaceRedditPicURL = /(https?:\/\/preview.redd.it\/[^ ]*)/ig;
				newestPost = {
					title: post.title.replaceAll("&amp;", "&"),
					url: post.url,
					author: post.author,
					thumbnail: post.thumbnail,
					video: video,
					id: post.id,
					videoPath : filePath,
					text: `${post.selftext ? `${post.selftext.replaceAll("&amp;nbsp;", "").replaceAll("&amp;#x200B;","").replaceAll("&lt;", "<").replaceAll("&gt;", "").replaceAll("&amp;", "&").replaceAll(replaceRedditPicURL, "")}` : ""}`
				}
			});
            if(filePath !== null && !videoDuplicate) {
                //console.log("Last Reddit post has video");
                file.on('finish', function() {
                    fs.stat(filePath, (err, stats) => {
                        if(err) {
                            //console.log("Video nicht gefunden...");
                        } else {
                            fileSize = stats.size;
                        }
                        if(fileSize < 8000000) {
                            videoDesc = "Schau dir das Video unter dieser Nachricht an";
                            } else if (fileSize <= 0) {
                                    fs.unlink(newestPost.videoPath, (err) => {
                            if (err) { 
                                console.log(err);
                            } else {
                                //console.log(`Deleted video: ${newestPost.videoPath}`);
                            }
                                    });
                        } else {
                            videoDesc = "Schau dir das Video **ohne Ton** unter dieser Nachricht an \n\n **INFO** Dieses Video ist lediglich ohne Ton verfügbar bedingt durch Discord's Limitierungen";
                            fs.unlink(newestPost.videoPath, (err) => {
                                if (err) { 
                                    console.log(err);
                                } else {
                                    //console.log(`Deleted video: ${newestPost.videoPath}`);
                                }
                            });
                        }
                        if(videoDuplicate === false) {
                            if(newestPost.video !== null) {
                                embedleague = new MessageEmbed()
                                .setColor(`${color}`)
                                .setTitle(`${newestPost.title}`)
                                .setURL(`${newestPost.url}`)
                                .setDescription(videoDesc)
                                .setFooter(`Gepostet auf r/leagueoflegends von ${newestPost.author}`, `${client.guilds.cache.get("292007278205206530").iconURL()}`);
                            } else if(newestPost.video !== null && newestPost.text !== "") {
                                embedleague = new MessageEmbed()
                                .setColor(`${color}`)
                                .setTitle(`${newestPost.title}`)
                                .setDescription(`${newestPost.text} \n\n ${videoDesc}`)
                                .setURL(`${newestPost.url}`)
                                .setFooter(`Gepostet auf r/leagueoflegends von ${newestPost.author}`, `${client.guilds.cache.get("292007278205206530").iconURL()}`);
                            }
                            if(0 < fileSize && fileSize < 8000000) {
                                channel2.send({
                                    embeds: [embedleague]
                                });
                                channel2.send({
                                    files: [newestPost.videoPath]
                                });
                                fs.readdir('./reddit_vids', (err, files) => {
                                    if (err) {
                                        console.log(err);
                                    }

                                    files.forEach(file => {
                                        const fileDir = path.join('./reddit_vids', file);

                                        if (file !== `${newestPost.id}.mp4`) {
                                            fs.unlink(fileDir, (err) => {
                                                if (err) { 
                                                    console.log(err);
                                                } else {
                                                    //console.log(`Deleted video: ${newestPost.videoPath}`);
                                                }
                                            });
                                        }
                                    });
                                });
                            } else {
                                channel2.send({
                                    embeds: [embedleague]
                                });
                                channel2.send(newestPost.video);
                            }
                        }
                    });
                });
            }
            if(newestPost.video === null && lastMessage.embeds[0] !== undefined && lastMessage.embeds[0].url !== newestPost.url || lastMessage.attachments.size !== 0 && lastMessage.attachments.toJSON()[0].contentType === "video/mp4") {
                //console.log("Last Reddit post is a text");
                if(newestPost.text !== "") {
                    embedleague = new MessageEmbed()
                    .setColor(`${color}`)
                    .setTitle(`${newestPost.title}`)
                    .setDescription(`${newestPost.text}`)
                    .setURL(`${newestPost.url}`)
                    .setFooter(`Gepostet auf r/leagueoflegends von ${newestPost.author}`, `${client.guilds.cache.get("292007278205206530").iconURL()}`);
                } else if(newestPost.text !== "" && newestPost.thumbnail !== 'self') {
                    embedleague = new MessageEmbed()
                    .setColor(`${color}`)
                    .setTitle(`${newestPost.title}`)
                    .setDescription(`${newestPost.text}`)
                    .setImage(`${newestPost.thumbnail}`)
                    .setURL(`${newestPost.url}`)
                    .setFooter(`Gepostet auf r/leagueoflegends von ${newestPost.author}`, `${client.guilds.cache.get("292007278205206530").iconURL()}`);
                } else if(newestPost.thumbnail !== 'self') {
                    embedleague = new MessageEmbed()
                    .setColor(`${color}`)
                    .setTitle(`${newestPost.title}`)
                    .setImage(`${newestPost.thumbnail}`)
                    .setURL(`${newestPost.url}`)
                    .setFooter(`Gepostet auf r/leagueoflegends von ${newestPost.author}`, `${client.guilds.cache.get("292007278205206530").iconURL()}`);
                }
                if (newestPost.video === null) {
                    if(redditPics.length === 1) {
                        embedleague.setImage(redditPics[0]);
                        channel2.send({
                            embeds: [embedleague]
                        });
                    } else if(redditPics.length > 1) {
                        for(let i = 1; i < redditPics.length; i++) {
                            if(redditPics[i] !== "") {
                                embedleague = new MessageEmbed()
                                .setColor(`${color}`)
                                .setTitle(`${newestPost.title}`)
                                .setImage(redditPics[i])
                                .setURL(`${newestPost.url}`)
                                .setFooter(`Gepostet auf r/leagueoflegends von ${newestPost.author}`, `${client.guilds.cache.get("292007278205206530").iconURL()}`);
                                channel2.send({
                                    embeds: [embedleague]
                                });
                            }
                        }
                    } else {
                        channel2.send({
                            embeds: [embedleague]
                        });
                    }
                }
			}
		}).catch(console.error);
	}, 30000);
});

client.on('guildMemberAdd', async member => {
	console.log("Neues Mitglied: " + member.user.tag);
	member.guild.invites.fetch().then(newInvites => {
		const oldInvites = invites.get(member.guild.id);
		const invite = newInvites.find(i => i.uses > oldInvites.get(i.code));
		console.log(invite.code);
		if (invite.code === "Y7YJDhEjfM") {
			var role = member.guild.roles.cache.find(role => role.name == "Clash");
			member.roles.add(role);
		} else {
			var role = member.guild.roles.cache.find(role => role.name == "🌟Member");
			member.roles.add(role);
		}
	});
	const channel = member.guild.channels.cache.find(channel => channel.name === "🚪eingangsbereich");
	let name = member.user.tag;
	const canvas = Canvas.createCanvas(2430, 1056);
	const context = canvas.getContext('2d');
	const welcomefg = await Canvas.loadImage('./serverjoin.png');
	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({
		format: "jpg"
	}));
	context.drawImage(avatar, 1346, 182, 600, 600);
	context.drawImage(welcomefg, 0, 0, canvas.width, canvas.height);
	const attachment = new MessageAttachment(canvas.toBuffer(), 'profile-image.png');

	const embedwelcome = new MessageEmbed()
		.setColor(`${color}`)
		.setTitle(`Heißt ${name} auf \n${member.guild.name} willkommen!`)
		.setImage('attachment://profile-image.png')
		.setFooter(`${member.guild.name} hat nun ${member.guild.memberCount} Mitglieder`, `${member.guild.iconURL()}`);
	channel.send({
		embeds: [embedwelcome],
		files: [attachment]
	});
});

client.on('guildMemberRemove', async member => {
	console.log("Mitglied hat verlassen: " + member.user.tag);
	const channel = member.guild.channels.cache.find(channel => channel.name === "🚪eingangsbereich");
	let name = member.user.tag;
	const canvas = Canvas.createCanvas(2430, 1056);
	const context = canvas.getContext('2d');
	const welcomefg = await Canvas.loadImage('./serverleave.png');
	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({
		format: "jpg"
	}));
	context.drawImage(avatar, 1346, 182, 600, 600);
	context.drawImage(welcomefg, 0, 0, canvas.width, canvas.height);
	const attachment = new MessageAttachment(canvas.toBuffer(), 'profile-image.png');

	const embedleave = new MessageEmbed()
		.setColor(`${color}`)
		.setTitle(`${name} sagt Tschüss zu \n${member.guild.name}`)
		.setImage('attachment://profile-image.png')
		.setFooter(`${member.guild.name} hat nun ${member.guild.memberCount} Mitglieder`, `${member.guild.iconURL()}`);
	channel.send({
		embeds: [embedleave],
		files: [attachment]
	});
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return;
	try {
		await command.execute(interaction);
	} catch (error) {
		//console.log(error);
		//return interaction.editReply({ content: 'Oh Tut mir leid, da ist wohl was schiefgelaufen :/ ' + error, ephemeral: true });
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
	if (queue != undefined) {
		if (queue.songs.length !== 0 || queue.songs) {
			switch (interaction.customId) {
				case "stop":
					console.log(interaction.customId);
					if (queue.playing) {
						client.user.setPresence({
							status: "dnd",
							activities: [{
								name: "momentan nichts..."
							}]
						});
						distube.stop(interaction.guildId);
						const embedstop = new MessageEmbed()
							.setColor(`${color}`)
							.setTitle(`${leaveemoji} Ich gehe ja schon`)
							.setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
						interaction.reply({
							embeds: [embedstop]
						});
					} else {
						const embedstopfailed = new MessageEmbed()
							.setColor(`${color}`)
							.setTitle(` ${leaveemoji} Ich spiele doch schon nicht mehr`)
							.setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
						interaction.reply({
							ephemeral: true,
							embeds: [embedstopfailed]
						});
					}
					break;
				case "skip":
					console.log(interaction.customId);
					if (queue.songs.length > 1) {
						distube.skip(interaction.guildId);
						const embedskipped = new MessageEmbed()
							.setColor(`${color}`)
							.setTitle(`${skipemoji} Song wurde geskipped`)
							.setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
						interaction.reply({
							embeds: [embedskipped]
						});
					} else {
						const embedskippedfailed = new MessageEmbed()
							.setColor(`${color}`)
							.setTitle(`${skipemoji} Song konnte nicht geskipped werden, da kein weiterer Song in der Warteschlange ist`)
							.setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
						interaction.reply({
							ephemeral: true,
							embeds: [embedskippedfailed]
						});
					}
					break;
				case "playpause":
					console.log(interaction.customId);
					if (queue.playing) {
						distube.pause(interaction.guildId);
						const embedpause = new MessageEmbed()
							.setColor(`${color}`)
							.setTitle(`${pauseemoji} Song wird angehalten`)
							.setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
						interaction.reply({
							embeds: [embedpause]
						});
					} else {
						distube.resume(interaction.guildId);
						const embedplay = new MessageEmbed()
							.setColor(`${color}`)
							.setTitle(`${playemoji} Song wird abgespielt`)
							.setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
						interaction.reply({
							embeds: [embedplay]
						});
					}
					break;
				case "repeatsong":
					console.log(interaction.customId);
					if (queue.repeatMode === 0 || queue.repeatMode === 2) {
						distube.setRepeatMode(interaction.guild, 1);
						const embedrepeatsong = new MessageEmbed()
							.setColor(`${color}`)
							.setTitle(`${queuesongemoji} Song wird wiederholt`)
							.setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
						interaction.reply({
							embeds: [embedrepeatsong]
						});
					} else if (queue.repeatMode === 1) {
						distube.setRepeatMode(interaction.guild, 0);
						const embedrepeatsongstop = new MessageEmbed()
							.setColor(`${color}`)
							.setTitle(`${queuesongemoji} Song wird nicht mehr wiederholt`)
							.setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
						interaction.reply({
							embeds: [embedrepeatsongstop]
						});
					}
					break;
				case "repeatqueue":
					console.log(interaction.customId);
					if (queue.repeatMode === 0 || queue.repeatMode === 1) {
						distube.setRepeatMode(interaction.guild, 2);
						const embedrepeatsong = new MessageEmbed()
							.setColor(`${color}`)
							.setTitle(`${queueemoji} Warteschlange wird wiederholt`)
							.setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
						interaction.reply({
							embeds: [embedrepeatsong]
						});
					} else if (queue.repeatMode === 2) {
						distube.setRepeatMode(interaction.guild, 0);
						const embedrepeatsongstop = new MessageEmbed()
							.setColor(`${color}`)
							.setTitle(`${queueemoji} Warteschlange wird nicht mehr wiederholt`)
							.setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
						interaction.reply({
							embeds: [embedrepeatsongstop]
						});
					}
					break;
			}
		}
	} else {
		if ("nextbtn" !== interaction.customId && "previousbtn" !== interaction.customId) {
			const embednoqueue = new MessageEmbed()
				.setColor(`${color}`)
				.setTitle(`${leaveemoji} Du kannst dies nicht tun, da kein Lied läuft`)
				.setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
			interaction.reply({
				ephemeral: true,
				embeds: [embednoqueue]
			});
		}
	}
});

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isSelectMenu()) return;
	if (interaction.member.nickname != null) {
		nick2 = interaction.member.nickname;
	} else {
		nick2 = interaction.user.username;
	}
	userpp2 = interaction.user.avatarURL();
    if(interaction.customId === "filter") {
      queue = distube.getQueue(interaction.guildId);
      if (queue != undefined) {
        if (queue.songs.length !== 0 || queue.songs) {
          let setfilter = interaction.values;
          console.log(setfilter);
          if (queue.playing && setfilter != "false") {
            distube.setFilter(queue, `${setfilter}`);
            const filtertext = capitalizeFirstLetter(setfilter.toString());
            const embedfilterapply = new MessageEmbed()
            .setColor(`${color}`)
            .setTitle(`Okay ich habe ${filtertext} als Effekt angewendet`)
            .setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
            interaction.reply({
              embeds: [embedfilterapply]
            });
          } else {
            distube.setFilter(queue, false);
            const embedfilterstop = new MessageEmbed()
            .setColor(`${color}`)
            .setTitle(`Okay ich habe alle Filter deaktiviert`)
            .setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
            interaction.reply({
              embeds: [embedfilterstop]
            });
          }
        }
      } else {
        const embednoqueue = new MessageEmbed()
        .setColor(`${color}`)
        .setTitle(`Du kannst dies nicht tun, da kein Lied läuft :thinking:`)
        .setFooter(`Ausgeführt von: ${nick2}`, `${userpp2}`);
        interaction.reply({
          ephemeral: true,
          embeds: [embednoqueue]
        });
      }
    } else if(interaction.customId === "games") {
      const guild = client.guilds.cache.get("292007278205206530");
        const member = guild.members.cache.get(interaction.member.user.id);
        const voiceChannel = member.voice.channel;
        let gameEmbedName;
        let gameEmbedImage = "https://cdn.discordapp.com/avatars/896008010005106730/ca62bf780a4568c94a3926d49ad31c21.webp?size=240";
        switch(interaction.values[0].toString()) {
          case "chess":
            gameEmbedName = "Schach";
            gameEmbedImage = "https://cdn.discordapp.com/avatars/896008010005106730/ca62bf780a4568c94a3926d49ad31c21.webp?size=240";
            break;
          case "poker":
            gameEmbedName = "Poker";
            gameEmbedImage = "https://cdn.discordapp.com/avatars/896008010005106730/ca62bf780a4568c94a3926d49ad31c21.webp?size=240";
            break;
          case "blazing8s":
            gameEmbedName = "Blazing 8's";
            gameEmbedImage = "https://cdn.discordapp.com/avatars/896008010005106730/ca62bf780a4568c94a3926d49ad31c21.webp?size=240";
            break;
          case "checkers":
            gameEmbedName = "Dame";
            gameEmbedImage = "https://cdn.discordapp.com/avatars/896008010005106730/ca62bf780a4568c94a3926d49ad31c21.webp?size=240";
            break;
          case "betrayal":
            gameEmbedName = "Betrayal";
            gameEmbedImage = "https://cdn.discordapp.com/avatars/896008010005106730/ca62bf780a4568c94a3926d49ad31c21.webp?size=240";
            break;
          case "fishing":
            gameEmbedName = "Fischen";
            gameEmbedImage = "https://cdn.discordapp.com/avatars/896008010005106730/ca62bf780a4568c94a3926d49ad31c21.webp?size=240";
            break;
          case "letterleague":
            gameEmbedName = "Letter League";
            gameEmbedImage = "https://cdn.discordapp.com/avatars/896008010005106730/ca62bf780a4568c94a3926d49ad31c21.webp?size=240";
            break;
          case "wordsnack":
            gameEmbedName = "Word Snack";
            gameEmbedImage = "https://cdn.discordapp.com/avatars/896008010005106730/ca62bf780a4568c94a3926d49ad31c21.webp?size=240";
            break;
          case "awkword":
            gameEmbedName = "Awkword";
            gameEmbedImage = "https://cdn.discordapp.com/avatars/896008010005106730/ca62bf780a4568c94a3926d49ad31c21.webp?size=240";
            break;
          case "spellcast":
            gameEmbedName = "Spellcast";
            gameEmbedImage = "https://cdn.discordapp.com/avatars/896008010005106730/ca62bf780a4568c94a3926d49ad31c21.webp?size=240";
            break;
          case "sketchheads":
            gameEmbedName = "Sketch Heads";
            gameEmbedImage = "https://cdn.discordapp.com/avatars/896008010005106730/ca62bf780a4568c94a3926d49ad31c21.webp?size=240";
            break;
		case "landio":
			gameEmbedName = "Land.io";
			gameEmbedImage = "https://cdn.discordapp.com/avatars/896008010005106730/ca62bf780a4568c94a3926d49ad31c21.webp?size=240";
			break;
		case "puttparty":
			gameEmbedName = "Putt Party";
			gameEmbedImage = "https://cdn.discordapp.com/avatars/896008010005106730/ca62bf780a4568c94a3926d49ad31c21.webp?size=240";
			break;
        }
        if(voiceChannel !== null) {
            const embedgame = new MessageEmbed()
            .setTitle(gameEmbedName)
            .setColor(`${color}`)
            .setThumbnail(gameEmbedImage)
            .setDescription("Klicke den folgenden Link um am Spiel teilzunehmen\n\n**Anleitung**\n Der Spieler der das Spiel starten will klickt den vom Bot gesendeten Link an, darauf hin werden die untenliegenden Knöpfe aktiviert und der andere Spieler kann beitreten.")
            .setFooter(`Ausgeführt von:  ${nick2}`, `${userpp2}`);
            await interaction.reply({
                embeds: [embedgame]
            });
            const game = new DiscordGame(token, `${interaction.values}`, 2, {neverExpire: false});
            game.play(voiceChannel).then(result => interaction.channel.send(result.inviteLink));
        } else {
            const embedgamefailed = new MessageEmbed()
            .setTitle(`${gameEmbedName}`)
            .setColor(`${color}`)
            .setThumbnail(gameEmbedImage)
            .setDescription(`${leaveemoji} Du befindest dich in keinem Voice-Channel`)
            .setFooter(`Ausgeführt von:  ${nick2}`, `${userpp2}`);
        await interaction.reply({
            embeds: [embedgamefailed], ephemeral: true
            });
        }  
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
		.setEmoji(`${leaveemoji}`)
		.setStyle('SECONDARY'),
	);

distube.on("addSong", (queue, song) => {
	if (queue.songs.length === 1) {
		queuetext = `${listemoji} Noch ${queue.songs.length} Lied in der Warteschlange`
	} else if (queue.songs.length > 1) {
		queuetext = `${listemoji} Noch ${queue.songs.length} Lieder in der Warteschlange`
	}
	desc = `${musicemoji} ${song.name}\n${stopwatchemoji} ${song.formattedDuration}\n\n${queuetext}`;
	if (song.playlist) {
		desc = `Playlist: ${song.playlist.name}\n\n${desc}`;
	}
	thumbnail = `${song.thumbnail}`
	url = `${song.url}`;
	if (song.member.nickname != null) {
		nick = song.member.nickname;
	} else {
		nick = song.user.username;
	}
	if (queue.songs.length > 1) {
		const embedqueue = new MessageEmbed()
			.setColor(`${color}`)
			.setTitle(`Song wurde zur Warteschlange hinzugefügt:`)
			.setDescription(desc)
			.setURL(url)
			.setThumbnail(thumbnail)
			.setFooter(`Ausgeführt von:  ${nick}`, `${song.user.avatarURL()}`);
		queue.textChannel.send({
			embeds: [embedqueue]
		});
	}
});

distube.on("addList", (queue, song) => {
	if (queue.songs.length === 1) {
		queuetext = `${listemoji} Noch ${queue.songs.length} Lied in der Warteschlange`
	} else if (queue.songs.length > 1) {
		queuetext = `${listemoji} Noch ${queue.songs.length} Lieder in der Warteschlange`
	}
	desc = `${musicemoji} ${song.name}\n${stopwatchemoji} ${song.formattedDuration}\n\n${queuetext}`;
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
	queue.textChannel.send({
		embeds: [embedqueueadd]
	});
});

distube.on("playSong", (queue, song) => {
	if (queue.songs.length === 1) {
		queuetext = `${listemoji} Noch ${queue.songs.length} Lied in der Warteschlange`
	} else if (queue.songs.length > 1) {
		queuetext = `${listemoji} Noch ${queue.songs.length} Lieder in der Warteschlange`
	}
	desc = `${musicemoji} ${song.name}\n${stopwatchemoji} ${song.formattedDuration}\n\n${queuetext}`;
	if (song.playlist) {
		desc = `Playlist: ${song.playlist.name}\n\n${desc}`;
	}
	thumbnail = `${song.thumbnail}`;
	url = `${song.url}`;
	if (song.member.nickname != null) {
		nick = song.member.nickname;
	} else {
		nick = song.user.username;
	}
	if (queue.songs.length >= 1 && queue) {
		client.user.setPresence({
			status: "online",
			activities: [{
				name: `${song.name}`,
				type: "STREAMING",
				url: `${song.url}`
			}]
		});
		const embed = new MessageEmbed()
			.setColor(`${color}`)
			.setTitle(`Ich spiele nun:`)
			.setDescription(desc)
			.setURL(url)
			.setThumbnail(thumbnail)
			.setFooter(`Ausgeführt von: ${nick}`, `${song.user.avatarURL()}`);
		queue.textChannel.send({
			ephemeral: false,
			embeds: [embed],
			components: [buttons]
		});
	}
});

distube.on("finishSong", (queue, song) => {
	client.user.setPresence({
		status: "dnd",
		activities: [{
			name: "momentan nichts..."
		}]
	});
});

distube.on("empty", (queue, song) => {
	client.user.setPresence({
		status: "dnd",
		activities: [{
			name: "momentan nichts..."
		}]
	});
});

distube.on("disconnect", (queue, song) => {
	client.user.setPresence({
		status: "dnd",
		activities: [{
			name: "momentan nichts..."
		}]
	});
});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection: (but tbh who tf cares because it works as intended)', error);
});

client.login(token);
