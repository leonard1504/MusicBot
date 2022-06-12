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
        .setName('games')
        .setDescription('Spiele Spiele mit deinen Freunden direkt im Discord Voice-Channel'),
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
                .setCustomId('games')
                .setPlaceholder('Kein Spiel ausgewählt')
                .addOptions([{
                        label: 'Poker',
                        description: 'Wer hat Lust auf Pokern?',
                        value: 'poker',
                    },
                    {
                        label: 'Schach',
                        description: 'Spiele Schach gegen deine Freunde',
                        value: 'chess',
                    },
                    {
                        label: 'Dame',
                        description: 'Spiele Dame gegen deine Freunde',
                        value: 'checkers',
                    },
                    {
                        label: "Blazing 8's",
                        description: 'Ähnlich wie Uno',
                        value: 'blazing8s',
                    },
                    {
                        label: "Land.io",
                        description: 'Nehme Felder ein und werde ein großes Land',
                        value: 'landio',
                    },
                    {
                        label: "Putt Party",
                        description: 'Golf ne Runde',
                        value: 'puttparty',
                    },
                    {
                        label: 'Betrayal',
                        description: 'Hintergeh deine Freunde',
                        value: 'betrayal',
                    },
                    {
                        label: 'Fischen',
                        description: 'Was könnte es spannenderes geben als zu Angeln mit deinen Freunden?',
                        value: 'fishing',
                    },
                    {
                        label: 'Letter League',
                        description: 'Finde so viele Wörter wie möglich (englisch)',
                        value: 'letterleague',
                    },
                    {
                        label: 'Word Snack',
                        description: 'Suche mehr Wörter als deine Gegner (englisch)',
                        value: 'wordsnack',
                    },
                    {
                        label: 'Awkword',
                        description: 'Stimmt für den besten Satz (englisch)',
                        value: 'awkword',
                    },
                    {
                        label: 'Spellcast',
                        description: 'Das Duell der Magier (englisch)',
                        value: 'spellcast',
                    },
                    {
                        label: 'Sketch Heads',
                        description: 'Probier das gemalte zu erraten (englisch)',
                        value: 'sketchheads',
                    },
                ]),
            );
        const embedfilters = new MessageEmbed()
            .setColor(`${color}`)
            .setTitle(`Wähle ein Spiel aus`)
            .setDescription('Spiele gegen deine Freunde im Voice-Channel')
            .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
        await interaction.reply({
            embeds: [embedfilters],
            components: [filters]
        });
    },
};