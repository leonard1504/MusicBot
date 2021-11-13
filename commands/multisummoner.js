const puppeteer = require('puppeteer');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { color, loadingemoji } = require("../config.json");
const { MessageEmbed, MessageAttachment } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('multisummoner')
        .addStringOption(option => option.setName('region').setRequired(true).setDescription("Gebe hier deine Region ein").addChoice('Westeuropa', 'euw.op.gg').addChoice('West- und Osteuropa', 'eune.op.gg').addChoice('Brasilien', 'br.op.gg').addChoice('Japan', 'jp.op.gg').addChoice('Korea', 'op.gg').addChoice('Lateinamerika Nord', 'lan.op.gg').addChoice('Lateinamerika Süd', 'las.op.gg').addChoice('Nordamerika', 'na.op.gg').addChoice('Ozeanien', 'oce.op.gg').addChoice('Russland', 'ru.op.gg').addChoice('Türkei', 'tr.op.gg'))
        .addStringOption(option => option.setName('summoner1').setRequired(true).setDescription("Gebe hier den ersten Summonername ein"))
        .addStringOption(option => option.setName('summoner2').setRequired(false).setDescription("Gebe hier den zweiten Summonername ein"))
        .addStringOption(option => option.setName('summoner3').setRequired(false).setDescription("Gebe hier den dritten Summonername ein"))
        .addStringOption(option => option.setName('summoner4').setRequired(false).setDescription("Gebe hier den vierten Summonername ein"))
        .addStringOption(option => option.setName('summoner5').setRequired(false).setDescription("Gebe hier den fünften Summonername ein"))
		.setDescription('Kriege einen Multi-Search Screenshot (op.gg) von den angegebenen Summonern'),
	async execute(interaction) {
        if (interaction.member.nickname != null) {
            nick = interaction.member.nickname;
        } else {
            nick = interaction.user.username;
        }
        userpp = interaction.user.avatarURL();
        const embedwaiting = new MessageEmbed()
            .setColor(`${color}`)
            .setTitle(`${loadingemoji} Screenshot wird erstellt...`)
            .setDescription(`Dies kann einen Moment dauern.`)
            .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
        interaction.reply({ embeds: [embedwaiting] });
        let s = [];
        for(let i = 1; i <= 5; i++) {
            let sname = `summoner${i}`
            try{
                s.push(interaction.options.get(sname).value);
            } catch {
                s.push("");
            }
        }
        let summonerstring = ``;
        summonerstring = s.filter(Boolean).map((sname) => ` **${sname}**`);
        console.log(summonerstring);
        
        const url = `https://${interaction.options.get('region').value}/multi/query=${s[0]}%2C${s[1]}%2C${s[2]}%2C${s[3]}%2C${s[4]}`;
        
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
    
        await page.goto(url);
        await page.setGeolocation({latitude:50, longitude:8});
        await page.waitForSelector('.css-1ey59fx');
        await page.click('.css-1ey59fx');
        
        await page.waitForSelector('.multi2__list');
        const element = await page.$('.multi2__list');
        const attachment = new MessageAttachment(await element.screenshot(), 'multiscreenshot.png');
        await browser.close(); 
        
        const embedmulti = new MessageEmbed()
            .setColor(`${color}`)
            .setTitle(`Hier der Multi-Search Screenshot von op.gg`)
            .setDescription(`Angegebene Summoner:${summonerstring}`)
            .setImage('attachment://multiscreenshot.png')
            .setURL(url)
            .setFooter(`Ausgeführt von: ${nick}`, `${userpp}`);
	    await interaction.editReply({ embeds: [embedmulti], files: [attachment] });
    }
}