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
const {
	client
} = require('./play')
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
            .setTitle(`Hilfe - Seite 1 von 5`)
            .setDescription(`${musicemoji} `+'**Musikbefehle**\n\n `/play <Songanme / YouTube-Link / Spotify-Link>`\n'+`${playemoji}`+'Spielt das gefundene Lied / die gefundene Playlist ab, wenn bereits ein Lied läuft wird es in die Warteschlange eingefügt \n\n `/queue`\n'+`${playemoji}`+'Zeigt die Warteschlange an \n\n `/filter`\n'+`${playemoji}`+'Öffnet ein Dropdown Menü um Filter auf das aktuelle Lied legen zu können \n\n `/shuffle`\n'+`${playemoji}`+'Mischt die Warteschlange durch \n\n `/lyrics`\n'+`${playemoji}`+'Zeigt die Lyrics des aktuellen Liedes an \n\n `/volume`\n'+`${playemoji}`+'Passt die Lautstärke an, falls keine Lautstärke angegeben gibt es die aktuelle Lautstärke zurück')
            .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`)
        );

        embedpages.push(new MessageEmbed()
            .setColor(`${color}`)
            .setTitle(`Hilfe - Seite 2 von 5`)
            .setDescription(':tools: **Utilitybefehle**\n\n `/whatis <random (optional), Suchbegriff>`\n'+`${playemoji}`+'Gibt die Definition des zufälligen oder gesuchten Begriffes von urban dictionary zurück \n\n `/lolstats <Spielername, Region>`\n'+`${playemoji}`+'Zeigt die League of Legends Stats des gesuchten Spielers an \n\n `/lolalytics <Champname, Highest Winrate / Most Common, Lane (optional), Elo (optional)>`\n'+`${playemoji}`+'Gibt das Build für den ausgewählten Champ laut Lolalytics zurück \n\n `/multisummoner <Region, Summonername 1, Summonername 2 (optional), Summonername 3 (optional), Summonername 4 (optional), Summonername 5 (optional)>`\n'+`${playemoji}`+'Gibt einen Multisummoner Screenshot von OP.gg zurück \n\n `/movemeback <Channel, onoff>`\n'+`${playemoji}`+'Moved den Nutzer in den angegebenen Channel zurück, falls dieser Ihn verlässt oder rausgemoved wird\nDIESES FEATURE IST WORK IN PROGRESS UND SOLLTE NICHT VERWENDET WERDEN\n\n `/clear <Anzahl>`\n'+`${playemoji}`+'Löscht die angegbene Anzahl an Nachrichten im aktuellen Channel\n Berechtigung: <@&318402122997563392> & <@&318401434255097856>\n\n `/help`\n'+`${playemoji}`+'Gibt genau den Text den du gerade ließt zurück lol')
            .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`)
        );

        embedpages.push(new MessageEmbed()
            .setColor(`${color}`)
            .setTitle(`Hilfe - Seite 3 von 5`)
            .setDescription(':joy: **Funbefehle**\n\n `/pokefusion`\n'+`${playemoji}`+'Zeigt dir ein Bild eines fusionierten Pokémons \n\n `/fakeperson`\n'+`${playemoji}`+'Gibt dir ein Bild von einer nicht existierenden Person \n\n `/affect <User>`\n'+`${playemoji}`+'Das Kind wird keine bleibenden Schäden davon tragen \n\n `/beautiful <User>`\n'+`${playemoji}`+'Die Person ist wunderhübsch \n\n `/bed <User, User>`\n'+`${playemoji}`+'Da ist ein Monster unter meinem Bett \n\n `/bonk <User>`\n'+`${playemoji}`+'BONK! Go to horny jail! \n\n `/delete <User>`\n'+`${playemoji}`+'Delete this shit! \n\n `/distracted <User, User, User (optional)>`\n'+`${playemoji}`+'Oh wer ist denn der hier?')
            .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`)
        );

        embedpages.push(new MessageEmbed()
            .setColor(`${color}`)
            .setTitle(`Hilfe - Seite 4 von 5`)
            .setDescription(':joy: **Funbefehle**\n\n `/hitler <User>`\n'+`${playemoji}`+'Diese Person ist schlimmer als Hitler \n\n `/jail <User>`\n'+`${playemoji}`+'Steck wen hinter schwedischen Gardinen \n\n `/kiss <User, User>`\n'+`${playemoji}`+'Nawwww wie süß \n\n `/pornhub <Name des PHub Kommentar erstellers, Nachricht, User>`\n'+`${playemoji}`+'Sus dass die Person auf PornHub nen Kommentar verfässt \n\n `/pixelated <User>`\n'+`${playemoji}`+'ZENSUR! \n\n `/rip <User>`\n'+`${playemoji}`+'Well R.I.P. \n\n `/shit <User>`\n'+`${playemoji}`+'Ihhhh ich bin in Scheiße getreten \n\n `/spank <User, User>`\n'+`${playemoji}`+'Yes spank me daddy')
            .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`)
        );

        embedpages.push(new MessageEmbed()
            .setColor(`${color}`)
            .setTitle(`Hilfe - Seite 5 von 5`)
            .setDescription(':joy: **Funbefehle**\n\n `/trash <User>`\n'+`${playemoji}`+'Sieht aus wie Müll \n\n `/trigger <User>`\n'+`${playemoji}`+'Jemand ist triggered \n\n `/woosh <User>`\n'+`${playemoji}`+'Der Witz ist einfach über deinen Kopf rüber geflogen \n\n `/youtube`\n'+`${playemoji}`+'Starte in deinem aktuellen Voice-Channel eine YouTube Watch Together Party \n\n `/games`\n'+`${playemoji}`+'Starte in deinem aktuellen Voice-Channel diverse Spiele')
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
        paginationEmbed.interactionHelpEmbed(interaction, embedpages, buttonList, timeout);
    }
}
