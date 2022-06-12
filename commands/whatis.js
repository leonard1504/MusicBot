const puppeteer = require('puppeteer');
const translate = require("deepl");
const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    color,
    loadingemoji,
    leaveemoji,
    deeplkey
} = require("../config.json");
const {
    MessageEmbed,
    MessageAttachment
} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('whatis')
        .addBooleanOption(option => option.setName('random').setRequired(false).setDescription("Falls du diesen Wert auf random setzt kriegst du eine zufällige Definition von urban dictionary"))
        .addStringOption(option => option.setName('search').setRequired(false).setDescription("Gebe hier die Sache ein die du auf urban dictionary suchen willst"))
        .setDescription('Liefert dir die Top Antwort von urban dictionary zu dem gesuchten Begriff'),
    async execute(interaction) {
        if (interaction.member.nickname != null) {
            nick = interaction.member.nickname;
        } else {
            nick = interaction.user.username;
        }
        userpp = interaction.user.avatarURL();
        try {
            random = interaction.options.get('random').value;
        } catch(e) {
            random = false;
        }
        const embedwaiting = new MessageEmbed()
            .setColor(`${color}`)
            .setTitle(`${loadingemoji} Screenshot wird erstellt...`)
            .setDescription(`Dies kann einen Moment dauern.`)
            .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
        await interaction.reply({
            embeds: [embedwaiting]
        });
        let url;
        if(!random) {
            try{
                console.log(`urban dictionary searching for: ${interaction.options.get('search').value}`);
                url = `https://www.urbandictionary.com/define.php?term=${interaction.options.get('search').value}`;
                embedurl = url.replaceAll(' ', '%20');
            } catch(e) {
                const embedurbansearchfailed = new MessageEmbed()
                    .setColor(`${color}`)
                    .setTitle(`Kein Begriff angegben`)
                    .setDescription(`${leaveemoji} Du musst entweder einen Begriff angeben und suchen oder random auf true setzen`)
                    .setFooter(`Ausgeführt von: ${nick}`, `${userpp}`);
                await interaction.editReply({
                    embeds: [embedurbansearchfailed]
                });
            }
        }
        const urlrandom = `https://www.urbandictionary.com/random.php`;

        const browser = await puppeteer.launch({
            args: ["--no-sandbox"],
            ignoreDefaultArgs: ['--disable-extensions']
        });
        const page = await browser.newPage();
        if(random) {
            await page.goto(urlrandom);
        } else {
            await page.goto(url);
        }
        await page.emulateMediaFeatures([{name: 'prefers-color-scheme', value: 'dark' }]);
        try {
        await page.waitForSelector('.definition');
        const element = await page.$('.definition div.p-5');
        const title = await page.$('.definition div.p-5 div.mb-8');
        let titleinfo = await page.evaluate(el => el.textContent, title);
        let titleGER = await translate({free_api: true, text: `${titleinfo}`, target_lang: 'DE', auth_key: `${deeplkey}`});
        titleGER = titleGER.data.translations[0].text;
        const desc = await page.$('.definition div.p-5 div.meaning');
        let descinfo = await page.evaluate(el => el.textContent, desc);
        let descGER = await translate({free_api: true, text: `${descinfo}`, target_lang: 'DE', auth_key: `${deeplkey}`});
        descGER = descGER.data.translations[0].text;
        const example = await page.$('.definition div.p-5 div.example');
        let exampleinfo = await page.evaluate(el => el.textContent, example);
        let exampleGER = await translate({free_api: true, text: `${exampleinfo}`, target_lang: 'DE', auth_key: `${deeplkey}`});
        exampleGER = exampleGER.data.translations[0].text;
        const attachment = new MessageAttachment(await element.screenshot(), 'urbandictionary.png');
        await browser.close();
        if(!random) { 
            const embedurban = new MessageEmbed()
                .setColor(`${color}`)
                .setTitle(`Hier der Screenshot von urban dictionary`)
                .setDescription(`Hier ist die Definition von **${interaction.options.get('search').value}** laut urban dictionary\n\n:map: **Übersetzung:**\n${titleGER}\n\n${descGER}\n\n${exampleGER}`)
                .setImage('attachment://urbandictionary.png')
                .setURL(embedurl)
                .setFooter(`Ausgeführt von: ${nick}`, `${userpp}`);
            await interaction.editReply({
                embeds: [embedurban],
                files: [attachment]
            });
        } else {
            const embedurbanrandom = new MessageEmbed()
                .setColor(`${color}`)
                .setTitle(`Hier der Screenshot von urban dictionary`)
                .setDescription(`Hier ist eine zufällige Definition von urban dictionary\n\n:map: **Übersetzung:**\n${titleGER}\n\n${descGER}\n\n${exampleGER}`)
                .setImage('attachment://urbandictionary.png')
                .setFooter(`Ausgeführt von: ${nick}`, `${userpp}`);
            await interaction.editReply({
                embeds: [embedurbanrandom],
                files: [attachment]
            });
        }
        } catch(e) {
            console.log(e);
            const embedurbanfailed = new MessageEmbed()
                .setColor(`${color}`)
                .setTitle(`Begriff konnte nicht gefunden werden`)
                .setDescription(`${leaveemoji} Definition von **${interaction.options.get('search').value}** konnte auf urban dictionary nicht gefunden werden`)
                .setFooter(`Ausgeführt von: ${nick}`, `${userpp}`);
            await interaction.editReply({
                embeds: [embedurbanfailed]
            });
        }
    }
}