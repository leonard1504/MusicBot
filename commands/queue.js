const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    color,
    stopwatchemoji,
    musicemoji,
    listemoji,
    backemoji,
    skipemoji
} = require("../config.json");
const {
    distube
} = require('./play');
const {
    MessageEmbed,
    MessageButton
} = require('discord.js');
const paginationEmbed = require('../queuepagination');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Zeigt alle Lieder in der Wartschlange an'),
    async execute(interaction) {
        if (interaction.member.nickname != null) {
            nick = interaction.member.nickname;
        } else {
            nick = interaction.user.username;
        }
        userpp = interaction.user.avatarURL();
        let temp;
        let pages = [];
        let embedpages = [];
        try {
            queue = distube.getQueue(interaction.guildId);
            showqueue = queue.songs.map((song, id) => `**${id+1}**.${musicemoji} ${song.name} - ${stopwatchemoji} ${song.formattedDuration}`);
            for (let i = 1; i <= Math.ceil(showqueue.length / 20); i++) {
                for (let i = 1; i <= Math.ceil(showqueue.length / 20); i++) {
                    if (i === 1) {
                        temp = showqueue.join("\n").split(`**${i*2}1**.`)[0];
                        pages.push(temp);
                    } else {
                        pages.push(showqueue.join("\n").split(`**${i*2}1**.`)[0].replace(temp, ""));
                        temp = temp + showqueue.join("\n").split(`**${i*2}1**.`)[0].replace(temp, "");
                    }
                }
                embedpages.push(new MessageEmbed()
                    .setColor(`${color}`)
                    .setTitle(`Warteschlange - Seite ${i} von ${Math.ceil(showqueue.length / 20)}`)
                    .setDescription(`${listemoji} Hier sind alle Lieder die momentan in der Wartschlange sind \n\n${pages[i-1]}`)
                    .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`)
                );
            }

            const button1 = new MessageButton()
                .setCustomId('previousbtn')
                .setEmoji(`${backemoji}`)
                .setStyle('SECONDARY');

            const button2 = new MessageButton()
                .setCustomId('nextbtn')
                .setEmoji(`${skipemoji}`)
                .setStyle('SECONDARY');

            buttonList = [button1, button2];

            const timeout = 15000;

            paginationEmbed.interactionEmbed(interaction, embedpages, buttonList, timeout);

        } catch (e) {
            console.log(e);
            const embedqueuefail = new MessageEmbed()
                .setColor(`${color}`)
                .setTitle(`${listemoji} Es sind **keine** Lieder in der Warteschlange`)
                .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
            interaction.reply({
                ephemeral: true,
                embeds: [embedqueuefail]
            });
        }
    },
};