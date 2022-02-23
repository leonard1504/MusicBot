const puppeteer = require('puppeteer');
const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    color,
    loadingemoji,
    leaveemoji
} = require("../config.json");
const {
    MessageEmbed,
    MessageAttachment
} = require('discord.js');
const fetch = require('cross-fetch');
const fs = require('fs');
const Canvas = require("canvas");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName('lolalytics')
        .addStringOption(option => option.setName('champ').setRequired(true).setDescription("Gebe hier den Championname an"))
        .addStringOption(option => option.setName('build').setRequired(true).setDescription("Gebe hier an ob du Highest Winrate oder Most Common willst").addChoice('Highest Winrate', 'hw').addChoice('Most Common', 'mc'))
        .addStringOption(option => option.setName('lane').setRequired(false).setDescription("Gebe hier die Lane an").addChoice("Top", "top").addChoice("Jungle", "jungle").addChoice("Mid", "middle").addChoice("Bot", "bottom").addChoice("Support", "support"))
        .addStringOption(option => option.setName('elo').setRequired(false).setDescription("Gebe hier die Elo an (Bsp. Platin, Challenger, OTP,...)").addChoice('Unranked', 'unranked').addChoice('Alle Ränge', 'all').addChoice('Iron', 'iron').addChoice('Bronze', 'bronze').addChoice('Silber', 'silver').addChoice('Gold', 'gold').addChoice('Platin', 'platinum').addChoice('Diamant', 'diamond').addChoice('Master', 'master').addChoice('Grandmaster', 'grandmaster').addChoice('Challenger', 'challenger').addChoice('Gold+', 'gold_plus').addChoice('Platin+', 'platinum_plus').addChoice('Diamant+', 'diamond_plus').addChoice('Master+', 'master_plus').addChoice('Diamant 2+', 'd2_plus').addChoice('One Trick Pony', '1trick'))
        .setDescription('Kriege einen Screenshot von dem vorgeschlagenden Lolalytics-Build'),
    async execute(interaction) {
        if (interaction.member.nickname != null) {
            nick = interaction.member.nickname;
        } else {
            nick = interaction.user.username;
        }
        userpp = interaction.user.avatarURL();
        let urlpartstring;
        let champ = interaction.options.get('champ').value;
        let build = interaction.options.get('build').value;
        let lane, tier, buildtype;

        try {
            lane = interaction.options.get('lane').value;
        } catch {
            lane = "-";
        }

        try {
            tier = interaction.options.get('tier').value;
        } catch {
            tier = "-";
        }

        if (lane != "-" && tier == "-") {
            urlpartstring = `/?lane=${lane}`
        } else if (tier != "-" && lane == "-") {
            urlpartstring = `/?tier=${tier}`
        } else if (tier != "-" && lane != "-") {
            urlpartstring = `/?lane=${lane}&tier=${tier}`
        } else {
            urlpartstring = `/`
        }
        const url = `https://lolalytics.com/lol/${champ.toLowerCase()}/build${urlpartstring}`;
        console.log(url);

        const browser = await puppeteer.launch({
            args: ["--no-sandbox"],
            ignoreDefaultArgs: ['--disable-extensions']
        });
        const embedwaiting = new MessageEmbed()
            .setColor(`${color}`)
            .setTitle(`${loadingemoji} Screenshot wird erstellt...`)
            .setDescription(`Dies kann einen Moment dauern.`)
            .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
        interaction.reply({
            embeds: [embedwaiting]
        });
        const page = await browser.newPage();
        await page.goto(url);
        await page.setDefaultTimeout(10000);
        await page.waitForSelector("button.ncmp__btn");
        const selectors = await page.$$('button.ncmp__btn')
        await selectors[1].click();

        try {

            await page.waitForSelector("div.Menu_wrapper__1nX2N");
            let div_selector_to_remove = "div.Menu_wrapper__1nX2N";
            await page.evaluate((sel) => {
                var elements = document.querySelectorAll(sel);
                for (var i = 0; i < elements.length; i++) {
                    elements[i].parentNode.removeChild(elements[i]);
                }
            }, div_selector_to_remove)

            try {
                let element0 = await page.$('h3');
                let textinfo0 = await page.evaluate(el => el.textContent, element0);
                if (textinfo0.toString().includes("No data")) {
                    const embedfailed = new MessageEmbed()
                        .setColor(`${color}`)
                        .setTitle(`${leaveemoji} Build konnte nicht gefunden werden.`)
                        .setDescription(`Es gibt keine relevanten Daten für deine Suchanfrage`)
                        .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
                    interaction.editReply({
                        embeds: [embedfailed]
                    });
                }
            } catch {
                await page.waitForSelector('div.ChampionHeader_stats__f84LW');
                let element2 = await page.$('div.ChampionHeader_stats__f84LW');
                let textinfo = await page.evaluate(el => el.textContent, element2);

                let winrateS = textinfo.split("Win Rate");
                let rankS = winrateS[1].toString().split("Rank");
                let tierS = rankS[1].toString().split("Tier");
                let pickrateS = tierS[1].toString().split("Pick Rate");
                let banrateS = pickrateS[1].toString().split("Ban Rate");
                let gamesS = banrateS[1].toString().split("Games");

                await page.waitForSelector('div.ButtonSet_wrapper__hjqnI');
                const selectors2 = await page.$$('div.ButtonSet_wrapper__hjqnI');
                if (build === "hw") {
                    buildtype = "Highest Winrate"
                    await selectors2[1].click();
                } else if (build === "mc") {
                    buildtype = "Most Common"
                    await selectors2[0].click();
                }

                let getVersion = await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`).then((resp) => resp.json());

                await page.waitForSelector('.Summary_quick__3le_e');
                const element = await page.$('.Summary_quick__3le_e');
                const champbuildinfo = await page.evaluate(el => el.textContent, element);
                let champLower = champ.toLowerCase();
                let championName = champLower.charAt(0).toUpperCase() + champLower.slice(1);
                let element3 = await page.$('div.ChampionHeader_champion__2ZqIZ.ChampionHeader_header__TkIzw');
                laneinfo = await page.evaluate(el => el.textContent, element3);
                if (lane != "-") {
                    laneName = lane.charAt(0).toUpperCase() + lane.slice(1);
                } else {
                    if (laneinfo.includes("middle")) {
                        laneName = `Mid`;
                    } else if (laneinfo.includes("top")) {
                        laneName = `Top`;
                    } else if (laneinfo.includes("jungle")) {
                        laneName = `Jungle`;
                    } else if (laneinfo.includes("support")) {
                        laneName = `Support`;
                    } else if (laneinfo.includes("bottom")) {
                        laneName = `Bot`
                    }
                }
                if (tier != "-") {
                    tier = tier.replace("_plus", "+");
                    tier = tier.replace("1trick", "one Trick Pony");
                    tier = tier.replace("all", "Alle Ränge");
                    tierName = tier.charAt(0).toUpperCase() + tier.slice(1);
                } else {
                    tierName = `${leaveemoji} Nicht angegeben`;
                }
                try {
                    let counters = laneinfo.split('counter to');
                    let counters2 = counters[1].toString().split('most by');
                    let counters3 = counters2[0].toString().split('while');
                    let counters4 = counters2[1].toString().split('. The');
                    counterstring = `${counters3[0]}`;
                    getscounterstring = `${counters4[0]}`;
                } catch {
                    counterstring = `${leaveemoji} Nicht angegeben`;
                    getscounterstring = `${leaveemoji} Nicht angegeben`;
                }
                console.log(counterstring);
                console.log(getscounterstring);

                if (champbuildinfo.includes("Insufficient")) {
                    const embedfailed = new MessageEmbed()
                        .setColor(`${color}`)
                        .setTitle(`${leaveemoji} Build konnte nicht gefunden werden.`)
                        .setDescription(`Tut mir leid es gibt nicht genügend relevante Daten um ein Build für **${championName} - ${laneName}** zu finden`)
                        .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
                    interaction.editReply({
                        embeds: [embedfailed]
                    });
                } else {
                    let time = Date.now();
                    /*await element.screenshot({
                        path: `./screenshots/champscreenshot_${time}.png`
                    });*/
                    const attachment = new MessageAttachment(await element.screenshot(), `champscreenshot_${time}.png`);

                    let champions = await fetch(`http://ddragon.leagueoflegends.com/cdn/${getVersion[0]}/data/de_DE/champion.json`).then((resp) => resp.json());
                    let champPic;

                    for (let j = 0; j < Object.values(champions.data).length; j++) {
                        if (Object.values(champions.data)[j].id.toLowerCase() === champLower) {
                            championName = Object.values(champions.data)[j].id;
                            console.log(championName);
                            champPic = `http://ddragon.leagueoflegends.com/cdn/${getVersion[0]}/img/champion/${championName}.png`;
                            break;
                        } else if (championName === "Wukong") {
                            champPic = `http://ddragon.leagueoflegends.com/cdn/${getVersion[0]}/img/champion/MonkeyKing.png`;
                        }
                    }

                    /*const canvas = Canvas.createCanvas(1036, 280);
                    const context = canvas.getContext('2d');
                    const image = await Canvas.loadImage(`./screenshots/champscreenshot_${time}.png`);
                    context.drawImage(image, 0, 0);
                    const attachment = new MessageAttachment(canvas.toBuffer(), `champscreenshot_${time}.png`);*/

                    const embedchamp = new MessageEmbed()
                        .setColor(`${color}`)
                        .setTitle(`Hier das vorgeschlagene Build von Lolalytics`)
                        .setDescription(`**Suchanfrage** - **${buildtype}**`)
                        .addFields({
                            name: "**Champion**",
                            value: `${championName}`,
                            inline: true,
                        }, {
                            name: "**Lane**",
                            value: `${laneName}`,
                            inline: true,
                        }, {
                            name: "**Elo**",
                            value: `${tierName}`,
                            inline: true,
                        })
                        .addFields({
                            name: `**${championName} - Info**`,
                            value: `Winrate: **${winrateS[0]}** \n Pickrate: **${pickrateS[0].replace("?", "")}** \n Banrate: **${banrateS[0]}**`,
                            inline: true,
                        }, {
                            name: "\u200b",
                            value: `Rang: **${rankS[0]}** \n Tier: **${tierS[0]}**`,
                            inline: true,
                        }, {
                            name: "\u200b",
                            value: `Spiele auf dieser Position: **${gamesS[0]}**`,
                            inline: true,
                        }, )
                        .addFields({
                            name: "**Counter gegen**",
                            value: `${counterstring}`,
                            inline: true,
                        }, {
                            name: "**Wird gecountered von**",
                            value: `${getscounterstring}`,
                            inline: true,
                        }, )
                        .setThumbnail(champPic)
                        .setImage(`attachment://champscreenshot_${time}.png`)
                        .setURL(url)
                        .setFooter(`Ausgeführt von: ${nick}`, `${userpp}`);
                    await interaction.editReply({
                        embeds: [embedchamp],
                        files: [attachment]
                    });
                    await browser.close();
                    /*try {
                        sleep(10000);
                        await fs.unlinkSync(`./screenshots/champscreenshot_${time}.png`);
                        console.log("Screenshot wurde erfolgreich wieder gelöscht!");
                    } catch (e) {
                        console.log("Es gab ein Fehler beim löschen, des Screenshots" + e.message);
                    }*/
                }
            }
        } catch (e) {
            console.log(e);
            const embedfailed = new MessageEmbed()
                .setColor(`${color}`)
                .setTitle(`${leaveemoji} Champion konnte nicht gefunden werden.`)
                .setDescription(`Tut mir leid Ich konnte keinen Champion mit dem Namen **${champ}** finden`)
                .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
            interaction.editReply({
                embeds: [embedfailed]
            });
        }
    }
}