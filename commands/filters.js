const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    color
} = require("../config.json");
const {
    MessageEmbed,
    MessageActionRow,
    MessageSelectMenu
} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('filter')
        .setDescription('Verbessere, oder auch verschlechtere, dein Musikerlebnis mit Filtern'),
    async execute(interaction) {
        if (interaction.member.nickname != null) {
            nick = interaction.member.nickname;
        } else {
            nick = interaction.user.username;
        }
        userpp = interaction.user.avatarURL();
        const filters = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                .setCustomId('filter')
                .setPlaceholder('Keinen Filter ausgewählt')
                .addOptions([{
                        label: 'Aus',
                        description: 'Deaktiviert den aktuellen Effekt',
                        value: 'false',
                    },
                    {
                        label: '3D',
                        description: 'Fügt einen 3D Effekt hinzu',
                        value: '3d',
                    },
                    {
                        label: 'Basboosted',
                        description: 'Fügt einen Bassboost Effekt hinzu',
                        value: 'bassboost',
                    },
                    {
                        label: 'Echo',
                        description: 'Fügt einen Echo Effekt hinzu',
                        value: 'echo',
                    },
                    {
                        label: 'Karaoke',
                        description: 'Fügt einen Karaoke Effekt hinzu',
                        value: 'karaoke',
                    },
                    {
                        label: 'Nightcore',
                        description: 'Fügt einen Nightcore Effekt hinzu',
                        value: 'nightcore',
                    },
                    {
                        label: 'Vaporwave',
                        description: 'Fügt einen Vaporwave Effekt hinzu',
                        value: 'vaporwave',
                    },
                    {
                        label: 'Flanger',
                        description: 'Fügt einen Flanger Effekt hinzu',
                        value: 'flanger',
                    },
                    {
                        label: 'Gate',
                        description: 'Fügt einen Gate Effekt hinzu',
                        value: 'gate',
                    },
                    {
                        label: 'Haas',
                        description: 'Fügt einen Haas Effekt hinzu',
                        value: 'haas',
                    },
                    {
                        label: 'Reverse',
                        description: 'Fügt einen Reverse Effekt hinzu',
                        value: 'reverse',
                    },
                    {
                        label: 'Surround',
                        description: 'Fügt einen Surround Effekt hinzu',
                        value: 'surround',
                    },
                    {
                        label: 'Mcompand',
                        description: 'Fügt einen Mcompand Effekt hinzu',
                        value: 'mcompand',
                    },
                    {
                        label: 'Phaser',
                        description: 'Fügt einen Phaser Effekt hinzu',
                        value: 'phaser',
                    },
                    {
                        label: 'Tremolo',
                        description: 'Fügt einen Tremolo Effekt hinzu',
                        value: 'tremolo',
                    },
                    {
                        label: 'Earwax',
                        description: 'Fügt einen Earwax Effekt hinzu',
                        value: 'earwax',
                    },
                ]),
            );
        const embedfilters = new MessageEmbed()
            .setColor(`${color}`)
            .setTitle(`Wähle einen Filter aus`)
            .setDescription(`Es können mehrere Filter auf einmal aktiviert sein. Bitte bedenke, dass besonders Filter wie z.B. Reverse eine Weile dauern können bis diese vollständig geladen wurden. Filter können auch ein Abbruch des Liedes hervorrufen, falls dies passiert probier es einfach nochmal.`)
            .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
        await interaction.reply({
            embeds: [embedfilters],
            components: [filters]
        });
    },
};