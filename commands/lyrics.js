const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    color,
    musicemoji,
    loadingemoji,
    geniusapikey,
    skipemoji,
    backemoji
} = require("../config.json");
const paginationEmbed = require('../queuepagination');
const {
    distube
} = require('./play');
const {
    MessageEmbed,
    MessageButton
} = require('discord.js');
const ytdl = require("ytdl-core");
//const lyricsFinder = require('lyrics-finder');
const Genius = require('genius-lyrics');
const Client = new Genius.Client(`${geniusapikey}`);
let lyrics;
module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('Zeigt die Lyrics des aktuellen Liedes an'),
    async execute(interaction) {
        if (interaction.member.nickname != null) {
            nick = interaction.member.nickname;
        } else {
            nick = interaction.user.username;
        }
        userpp = interaction.user.avatarURL();
        const embedwaiting = new MessageEmbed()
            .setColor(`${color}`)
            .setTitle(`${loadingemoji} Suche nach den Lyrics, dies kann einen Moment dauern... :smile:`)
            .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
        await interaction.reply({
            embeds: [embedwaiting]
        });
        queue = distube.getQueue(interaction.guildId);
        console.log(queue);
        if(queue) {
            songinfos = await ytdl.getInfo(`${queue.songs[0].url}`);
            artist = songinfos.videoDetails.media.artist;
            song = songinfos.videoDetails.media.song;
            if (artist && song) {
                console.log("Artist and Song defined searching...");
                song = song.split('(O');
                song.splice(1, 1);
                song = song.join('');
                song = song.split('[');
                song.splice(1, 1);
                song = song.join('');
                console.log("Song after removing brackets: " + song);
                const searches = await Client.songs.search(`${artist} ${song}`);
                lyrics = await searches[0].lyrics() || "notfound";
            }
            if (lyrics == "notfound" || !artist || !song) {
                console.log("Artist, Song or first search undefined, search method 2");
                song2 = `${queue.songs[0].name}`
                song2 = song2.split('(O');
                song2.splice(1, 1);
                song2 = song2.join('');
                song2 = song2.split('[');
                song2.splice(1, 1);
                song2 = song2.join('');
                song2 = song2.split('"');
                song2.splice(1, 1);
                song2 = song2.join('');
                console.log("Song after removing brackets and quotation mark: " + song2);
                const searches = await Client.songs.search(`${song2}`);
                lyrics = await searches[0].lyrics() || "notfound";
            }
            if (lyrics == "notfound") {
                interaction.deleteReply();
                const embedlyricsnotfound = new MessageEmbed()
                    .setColor(`${color}`)
                    .setTitle(`Lyrics nicht gefunden`)
                    .setDescription(`Ich konnte keine Lyrics für ${musicemoji} ${queue.songs[0].name} finden`)
                    .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
                interaction.channel.send({
                    embeds: [embedlyricsnotfound]
                });
            } else {
                interaction.deleteReply();
                embedmessages = [];
                let regex = /[[].*]/gm;
                lyrics = lyrics.replace(regex, "");
                regex = /^\s*$\n\n/gm;
                lyrics = lyrics.replace(regex, "\n");
                if(lyrics.length > 4000) {
                    regex = /^\s*$\n/gm;
                    let lineBreaks = lyrics.match(regex);
                    let splitLyrics = lyrics.split(regex, lineBreaks.length);
                    if(splitLyrics[0] === "") {
                        splitLyrics.splice(0,1);
                    }
                    let firstLyricPart = splitLyrics.slice(0, Math.floor(lineBreaks.length/2)).join("\n");
                    let secondLyricPart = splitLyrics.slice(Math.floor(lineBreaks.length/2)).join("\n");
                    embedmessages.push(new MessageEmbed()
                        .setColor(`${color}`)
                        .setTitle(`Lyrics - ${queue.songs[0].name}`)
                        .setDescription(`Bitte bedenke, dass die Lyrics **nicht immer** richtig seien könnten\n\n${musicemoji} Hier sind die Lyrics, die ich für den Song ${queue.songs[0].name} gefunden habe.\n\n${firstLyricPart}`)
                        .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`)
                    );
                    embedmessages.push(new MessageEmbed()
                        .setColor(`${color}`)
                        .setTitle(`Lyrics - ${queue.songs[0].name}`)
                        .setDescription(`Bitte bedenke, dass die Lyrics **nicht immer** richtig seien könnten\n\n${musicemoji} Hier sind die Lyrics, die ich für den Song ${queue.songs[0].name} gefunden habe.\n\n${secondLyricPart}`)
                        .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`)
                    );

                    const button1 = new MessageButton()
                        .setCustomId('previousbtn')
                        .setEmoji(`${backemoji}`)
                        .setStyle('SECONDARY');

                    const button2 = new MessageButton()
                        .setCustomId('nextbtn')
                        .setEmoji(`${skipemoji}`)
                        .setStyle('SECONDARY');

                    buttonList = [ button1, button2 ];
                    
                    const timeout = 30000;
                    await paginationEmbed.interactionLyricsEmbed(interaction, embedmessages, buttonList, timeout);
                }
                const embedlyrics = new MessageEmbed()
                    .setColor(`${color}`)
                    .setTitle(`Lyrics - ${queue.songs[0].name}`)
                    .setDescription(`Bitte bedenke, dass die Lyrics **nicht immer** richtig seien könnten\n\n${musicemoji} Hier sind die Lyrics, die ich für den Song ${queue.songs[0].name} gefunden habe.\n\n${lyrics}`)
                    .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
                interaction.channel.send({
                    embeds: [embedlyrics]
                });
            }
        } else if(queue === undefined){
            interaction.deleteReply();
            const embedqueuefail = new MessageEmbed()
                .setColor(`${color}`)
                .setTitle(`Es läuft momentan kein Lied von dem ich die Lyrics suchen könnte`)
                .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
            interaction.channel.send({
                embeds: [embedqueuefail]
            });
        }
    },
};