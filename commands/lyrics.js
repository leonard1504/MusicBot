const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    color,
    musicemoji,
    loadingemoji
} = require("../config.json");
const {
    distube
} = require('./play');
const {
    MessageEmbed
} = require('discord.js');
const ytdl = require("ytdl-core");
const lyricsFinder = require('lyrics-finder');
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
        if (queue.songs.length >= 1 && queue !== undefined) {
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
                console.log(await lyricsFinder(artist, song))
                lyrics = await lyricsFinder(artist, song) || "notfound";
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
                lyrics = await lyricsFinder("", song2) || "notfound";
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
                const embedlyrics = new MessageEmbed()
                    .setColor(`${color}`)
                    .setTitle(`Lyrics - ${song} von ${artist}`)
                    .setDescription(`Bitte bedenke, dass die Lyrics **nicht immer** richtig seien könnten, gibt Google die Schuld dafür nicht mir :(\n\n${musicemoji} Hier sind die Lyrics, die ich für den Song ${queue.songs[0].name} gefunden habe.\n\n${lyrics}`)
                    .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
                interaction.channel.send({
                    embeds: [embedlyrics]
                });
            }
        } else {
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