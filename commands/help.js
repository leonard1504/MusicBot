const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    color,
    backemoji,
    skipemoji,
    musicemoji,
    playemoji
} = require("../config.json");
const paginationEmbed = require('../queuepagination');
const {
    MessageEmbed,
    MessageButton
} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Zeigt dir eine Übersicht aller Befehle'),
    async execute(interaction) {
        if (interaction.member.nickname != null) {
            nick = interaction.member.nickname;
        } else {
            nick = interaction.user.username;
        }
        userpp = interaction.user.avatarURL();
        embedpages = [];

        embedpages.push(new MessageEmbed()
            .setColor(`${color}`)
            .setTitle(`Hilfe - Seite 1 von 3`)
            .setDescription(`${musicemoji} `+'**Musikbefehle**\n\n `/play <Songanme / YouTube-Link / Spotify-Link>`\n'+`${playemoji}`+'Spielt das gefundene Lied / die gefundene Playlist ab, wenn bereits ein Lied läuft wird es in die Warteschlange eingefügt \n\n `/queue`\n'+`${playemoji}`+'Zeigt die Warteschlange an \n\n `/filter`\n'+`${playemoji}`+'Öffnet ein Dropdown Menü um Filter auf das aktuelle Lied legen zu können \n\n `/shuffle`\n'+`${playemoji}`+'Mischt die Warteschlange durch \n\n `/lyrics`\n'+`${playemoji}`+'Zeigt die Lyrics des aktuellen Liedes an \n\n `/volume`\n'+`${playemoji}`+'Passt die Lautstärke an, falls keine Lautstärke angegeben gibt es die aktuelle Lautstärke zurück')
            .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`)
        );

        embedpages.push(new MessageEmbed()
            .setColor(`${color}`)
            .setTitle(`Hilfe - Seite 2 von 3`)
            .setDescription(':tools: **Utilitybefehle**\n\n `/whatis <random (optional), Suchbegriff>`\n'+`${playemoji}`+'Gibt die Definition des zufälligen oder gesuchten Begriffes von urban dictionary zurück \n\n `/lolstats <Spielername, Region>`\n'+`${playemoji}`+'Zeigt die League of Legends Stats des gesuchten Spielers an \n\n `/lolalytics <Champname, Highest Winrate / Most Common, Lane (optional), Elo (optional)>`\n'+`${playemoji}`+'Gibt das Build für den ausgewählten Champ laut Lolalytics zurück \n\n `/multisummoner <Region, Summonername 1, Summonername 2 (optional), Summonername 3 (optional), Summonername 4 (optional), Summonername 5 (optional)>`\n'+`${playemoji}`+'Gibt einen Multisummoner Screenshot von OP.gg zurück \n\n `/movemeback <Channel, onoff>`\n'+`${playemoji}`+'Moved den Nutzer in den angegebenen Channel zurück, falls dieser Ihn verlässt oder rausgemoved wird\nDIESES FEATURE IST WORK IN PROGRESS UND SOLLTE NICHT VERWENDET WERDEN\n\n `/help`\n'+`${playemoji}`+'Gibt genau den Text den du gerade ließt zurück lol')
            .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`)
        );

        embedpages.push(new MessageEmbed()
            .setColor(`${color}`)
            .setTitle(`Hilfe - Seite 3 von 3`)
            .setDescription(':joy: **Funbefehle**\n\n `/pokefusion`\n'+`${playemoji}`+'Zeigt dir ein Bild eines fusionierten Pokémons \n\n `/fakeperson`\n'+`${playemoji}`+'Gibt dir ein Bild von einer nicht existierenden Person')
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

        paginationEmbed.interactionEmbed(interaction, embedpages, buttonList, timeout);
    }
}
