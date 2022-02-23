const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton } = require('discord.js');
const { color, riotapikey, iron, bronze, silver, gold, plat, dia, master, grandmaster, challenger, leaveemoji, loadingemoji, skipemoji, backemoji } = require('../config.json');
const { LolApi, Constants } = require('twisted');
const fetch = require('cross-fetch');
const paginationEmbed = require('../queuepagination');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('lolstats')
        .addStringOption(option => option.setName('spielername').setRequired(true).setDescription("Gebe hier deinen Summonername ein"))
        .addStringOption(option => option.setName('region').setRequired(true).setDescription("Gebe hier deine Region ein").addChoice('Westeuropa', Constants.Regions.EU_WEST).addChoice('Osteuropa', Constants.Regions.EU_EAST).addChoice('Brasilien', Constants.Regions.BRAZIL).addChoice('Japan', Constants.Regions.JAPAN).addChoice('Korea', Constants.Regions.KOREA).addChoice('Lateinamerika Nord', Constants.Regions.LAT_NORTH).addChoice('Lateinamerika Süd', Constants.Regions.LAT_SOUTH).addChoice('Nordamerika', Constants.Regions.AMERICA_NORTH).addChoice('Ozeanien', Constants.Regions.OCEANIA).addChoice('Russland', Constants.Regions.RUSSIA).addChoice('Türkei', Constants.Regions.TURKEY))
		.setDescription('Zeigt die League of Legends Stats an'),
	async execute(interaction) {
        let wlratioflex, wlratiosolo, solostring, flexstring, soloranksymbol, flexranksymbol, summoner, rankedmmr, normalmmr, arammmr, soloduofirstname, soloduofirst, normalfirst, normalfirstname, flexfirst, flexfirstname, soloduosecondname, soloduosecond, normalsecond, normalsecondname, flexsecondname, flexsecond, soloduothird, soloduothirdname, normalthird, normalthirdname, flexthird, flexthirdname, normallanes, flexlanes, soloduolanes = "";
        let championsMastery = [];
        let topthreechampsMastery = [];
        let getVersion = await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`).then((resp) => resp.json());
        switch(interaction.options.get('region').value) {
            case Constants.Regions.EU_WEST:
                mmrregion = "euw";
                queryregion = "euw";
            break;
            case Constants.Regions.EU_EAST:
                mmrregion = "eune";
                queryregion = "eune";
            break;
            case Constants.Regions.RUSSIA:
                mmrregion = "eune";
                queryregion = "ru";
            break;
            case Constants.Regions.KOREA:
                mmrregion = "kr";
                queryregion = "kr";
            break;
            case Constants.Regions.OCEANIA:
                queryregion = "oce";
                mmrregion = "na";
            break;
            case Constants.Regions.JAPAN:
                queryregion = "jp";
                mmrregion = "na";
            break;
            case Constants.Regions.LAT_NORTH:
                queryregion = "lan";
                mmrregion = "na";
            break;
            case Constants.Regions.LAT_SOUTH:
                queryregion = "las";
                mmrregion = "na";
            break;
            case Constants.Regions.BRAZIL:
                queryregion = "br";
                mmrregion = "na";
            break;
            case Constants.Regions.TURKEY:
                queryregion = "tr";
                mmrregion = "na";
            break;
            default: 
                mmrregion = "na";
                queryregion = "na";
            break;
        }
        let getMMR = await fetch(`https://${mmrregion}.whatismymmr.com/api/v1/summoner?name=${encodeURI(interaction.options.get('spielername').value)}`).then((resp) => resp.json());

        if (interaction.member.nickname != null) {
            nick = interaction.member.nickname;
        } else {
            nick = interaction.user.username;
        }
        userpp = interaction.user.avatarURL();

        const api = new LolApi({ key: `${riotapikey}`, rateLimitRetry: true, rateLimitRetryAttempts: 3});

        try {
            summoner = await api.Summoner.getByName(interaction.options.get('spielername').value, interaction.options.get('region').value);
        } catch(e) {
            if(e.status === 404) {
                const embedusernotfound = new MessageEmbed()
                    .setColor(`${color}`)
                    .setTitle(`Tut mir leid`)
                    .setDescription(`${leaveemoji} Ich konnte keinen Nutzer mit dem Namen **${interaction.options.get('spielername').value}** in der angegebenen Region finden.`)
                    .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);
		        await interaction.reply({ ephemeral: true, embeds: [embedusernotfound] });
            }
        }

        const champion = await api.Champion.masteryBySummoner(summoner.response.id, interaction.options.get('region').value);
        let champions = await fetch(`http://ddragon.leagueoflegends.com/cdn/${getVersion[0]}/data/de_DE/champion.json`).then((resp) => resp.json());
     
        for(let i = 0; i <= 2; i++) {
            championsMastery.push(champion.response[i]);
            for(let j = 0; j < Object.values(champions.data).length; j++) {
                if(Object.values(champions.data)[j].key == championsMastery[i].championId) {
                    topthreechampsMastery.push(Object.values(champions.data)[j]);
                    break;
                }
            }
        }
        
        const rank = await api.League.bySummoner(summoner.response.id, interaction.options.get('region').value);

        if(rank.response.length > 0) {
            for(let x = 0; rank.response.length > x; x++) {
                switch(rank.response[x].queueType) {
                    case "RANKED_SOLO_5x5":
                        switch(rank.response[x].tier) {
                            case "IRON":
                                soloranksymbol = `${iron}`;
                            break;
                            case "BRONZE":
                                soloranksymbol = `${bronze}`;
                            break;
                            case "SILVER":
                                soloranksymbol = `${silver}`;
                            break;
                            case "GOLD":
                                soloranksymbol = `${gold}`;
                            break;
                            case "PLATINUM":
                                soloranksymbol = `${plat}`;
                            break;
                            case "DIAMOND":
                                soloranksymbol = `${dia}`;
                            break;
                            case "MASTER":
                                soloranksymbol = `${master}`;
                            break;
                            case "GRANDMASTER":
                                soloranksymbol = `${grandmaster}`;
                            break;
                            case "CHALLENGER":
                                soloranksymbol = `${challenger}`;
                            break;
                        }; 
                        wlratiosolo = Math.round((rank.response[x].wins/(rank.response[x].wins+rank.response[x].losses))*100);
                        solostring = `**${soloranksymbol} ${rank.response[x].tier} ${rank.response[x].rank}** \n LP: ${rank.response[x].leaguePoints} \n Gewonnen: ${rank.response[x].wins} \n Verloren: ${rank.response[x].losses} \n Winrate: ${wlratiosolo}%`;  
                break;
                case "RANKED_FLEX_SR":  
                    switch(rank.response[x].tier) {
                        case "IRON":
                            flexranksymbol = `${iron}`;
                        break;
                        case "BRONZE":
                            flexranksymbol = `${bronze}`;
                        break;
                        case "SILVER":
                            flexranksymbol = `${silver}`;
                        break;
                        case "GOLD":
                            flexranksymbol = `${gold}`;
                        break;
                        case "PLATINUM":
                            flexranksymbol = `${plat}`;
                        break;
                        case "DIAMOND":
                            flexranksymbol = `${dia}`;
                        break;
                        case "MASTER":
                            flexranksymbol = `${master}`;
                        break;
                        case "GRANDMASTER":
                            flexranksymbol = `${grandmaster}`;
                        break;
                        case "CHALLENGER":
                            flexranksymbol = `${challenger}`;
                        break
                    };
                    wlratioflex = Math.round((rank.response[1].wins/(rank.response[1].wins+rank.response[1].losses))*100);
                    flexstring = `**${flexranksymbol} ${rank.response[x].tier} ${rank.response[x].rank}** \n LP: ${rank.response[x].leaguePoints} \n Gewonnen: ${rank.response[x].wins} \n Verloren: ${rank.response[x].losses} \n Winrate: ${wlratioflex}%`;
                break;
                default: 
                    if(rank.response[x].queueType !== "RANKED_FLEX_SR") {
                        flexstring = `${leaveemoji} Keine Ranglistendaten gefunden`;
                    } else if(rank.response[x].queueType !== "RANKED_SOLO_5x5") {
                        solostring = `${leaveemoji} Keine Ranglistendaten gefunden`;
                    }
                break;
                }
            }
        }      
        try {
            if(getMMR.ranked.avg != null) {
                rankedmmr = `Die MMR in Rangliste beträgt circa **${getMMR.ranked.avg}** \n Damit wäre **${interaction.options.get('spielername').value}** circa **${getMMR.ranked.closestRank}**`;
            } else {
                rankedmmr = `${leaveemoji} Es liegen noch nicht genügend **Solospiele in Rangliste** vor um die MMR zu berechnen.`;
            }
            if(getMMR.normal.avg != null) {
                normalmmr = `Die MMR in Normal beträgt circa **${getMMR.normal.avg}** \n Damit wäre **${interaction.options.get('spielername').value}** circa **${getMMR.normal.closestRank}**`;
            } else {
                normalmmr = `${leaveemoji} Es liegen noch nicht genügend **Solospiele in Normal** vor um die MMR zu berechnen.`;
            }
            if(getMMR.ARAM.avg != null) {
                arammmr = `Die MMR in ARAM beträgt circa **${getMMR.ARAM.avg}** \n Damit wäre **${interaction.options.get('spielername').value}** circa **${getMMR.ARAM.closestRank}**`;
            } else {
                arammmr = `${leaveemoji} Es liegen noch nicht genügend **Solospiele in ARAM** vor um die MMR zu berechnen.`;
            }
        } catch(e) {
            rankedmmr = `${leaveemoji} Es liegen noch nicht genügend **Solospiele in Rangliste** vor um die MMR zu berechnen.`;
            normalmmr = `${leaveemoji} Es liegen noch nicht genügend **Solospiele in Normal** vor um die MMR zu berechnen.`;
            arammmr = `${leaveemoji} Es liegen noch nicht genügend **Solospiele in ARAM** vor um die MMR zu berechnen.`;
        }
        soloduo = [];
        flex = [];
        normals = [];
        try {
            let getXDXGGdata = await fetch(`https://api.xdx.gg/summoner/1/${queryregion}/${encodeURI(interaction.options.get('spielername').value)}`).then((resp) => resp.json());
            let puuid = getXDXGGdata.puuid;
            let getKDA = await fetch(`https://api.xdx.gg/stats/single/1/${queryregion}/${puuid}`).then((resp) => resp.json());
            let gamemodes = Object.values(Object.values(getKDA)[0]);
            if(Object.keys(Object.values(getKDA)[0]).includes("400")) {
                let indexN = Object.keys(Object.values(getKDA)[0]).indexOf("400");
                normallanes = `${interaction.options.get('spielername').value} hat in Normals \n **${gamemodes[indexN].lanes.top.n}** **Toplaner**-Spiele \n **${gamemodes[indexN].lanes.jungle.n}** **Jungler**-Spiele \n **${gamemodes[indexN].lanes.middle.n}** **Midlaner**-Spiele \n **${gamemodes[indexN].lanes.bottom.n}** **ADC**-Spiele \n **${gamemodes[indexN].lanes.support.n}** **Supporter**-Spiele`;
                normalschampid = [];
                champnames = [];
                for(let i = 0; i < Object.keys(gamemodes[indexN].champions.all).length; i++) {
                    let normalsdata = Object.values(gamemodes[indexN].champions.all)[i];
                    normalschampid.push(Object.keys(gamemodes[indexN].champions.all)[i]);
                    for(let j = 0; j < Object.values(champions.data).length; j++) {
                        if(Object.values(champions.data)[j].key == normalschampid[i]) {
                            champnames.push(Object.values(champions.data)[j].name);
                            break;
                        }
                    }
                    let normalschampdata = {
                        name: champnames[i],
                        stats: normalsdata
                    }
                    normals.push(normalschampdata);
                }
                normals.sort(function(a, b) {
                    var keyA = a.stats.n,
                        keyB = b.stats.n;
                    if (keyA > keyB) return -1;
                    if (keyA < keyB) return 1;
                    return 0;
                });
            } else {
                normallanes = `${leaveemoji} Es liegen für diesen Nutzer keine Normals Daten vor.`;
            }
            if(normals[0] != undefined && normals.length > 0) {
                normalfirstname = `${normals[0].name}`;
                normalfirst = `Gespielt: **${normals[0].stats.n}** \n Gewonnen: **${normals[0].stats.w}** \n Winrate: **${Math.round((normals[0].stats.w/normals[0].stats.n)*100)}%** \n Durschnittliche KDA: **${Math.round(((normals[0].stats.k+normals[0].stats.a)/normals[0].stats.d)*100)/100}** \n **${Math.round(((normals[0].stats.k)/normals[0].stats.n)*100)/100}/${Math.round(((normals[0].stats.d)/normals[0].stats.n)*100)/100}/${Math.round(((normals[0].stats.a)/normals[0].stats.n)*100)/100}** \n Durchschnittliche CS: **${Math.round((normals[0].stats.cs/normals[0].stats.n)*100)/100}**`;
            } else {
                normalfirst = `\u200b`;
                normalfirstname = `${leaveemoji} Keine Stats gefunden.`;
            }
            if(normals[1] != undefined && normals.length > 0) {
                normalsecondname = `${normals[1].name}`;
                normalsecond = `Gespielt: **${normals[1].stats.n}** \n Gewonnen: **${normals[1].stats.w}** \n Winrate: **${Math.round((normals[1].stats.w/normals[1].stats.n)*100)}%** \n Durschnittliche KDA: **${Math.round(((normals[1].stats.k+normals[1].stats.a)/normals[1].stats.d)*100)/100}** \n **${Math.round(((normals[1].stats.k)/normals[1].stats.n)*100)/100}/${Math.round(((normals[1].stats.d)/normals[1].stats.n)*100)/100}/${Math.round(((normals[1].stats.a)/normals[1].stats.n)*100)/100}** \n Durchschnittliche CS: **${Math.round((normals[1].stats.cs/normals[1].stats.n)*100)/100}**`;
            } else {
                normalsecond = `\u200b`
                normalsecondname = `${leaveemoji} Keine Stats gefunden.`
            }
            if(normals[2] != undefined && normals.length > 0) {
                normalthirdname = `${normals[2].name}`;
                normalthird = `Gespielt: **${normals[2].stats.n}** \n Gewonnen: **${normals[2].stats.w}** \n Winrate: **${Math.round((normals[2].stats.w/normals[2].stats.n)*100)}%** \n Durschnittliche KDA: **${Math.round(((normals[2].stats.k+normals[2].stats.a)/normals[2].stats.d)*100)/100}** \n **${Math.round(((normals[2].stats.k)/normals[2].stats.n)*100)/100}/${Math.round(((normals[2].stats.d)/normals[2].stats.n)*100)/100}/${Math.round(((normals[2].stats.a)/normals[2].stats.n)*100)/100}** \n Durchschnittliche CS: **${Math.round((normals[2].stats.cs/normals[2].stats.n)*100)/100}**`;
            } else {
                normalthird = `\u200b`
                normalthirdname = `${leaveemoji} Keine Stats gefunden.`
            }
            if(Object.keys(Object.values(getKDA)[0]).includes("420")) {
                let indexN = Object.keys(Object.values(getKDA)[0]).indexOf("420");
                soloduolanes = `${interaction.options.get('spielername').value} hat in Solo/Duo-Queue \n **${gamemodes[indexN].lanes.top.n}** **Toplaner**-Spiele \n **${gamemodes[indexN].lanes.jungle.n}** **Jungler**-Spiele \n **${gamemodes[indexN].lanes.middle.n}** **Midlaner**-Spiele \n **${gamemodes[indexN].lanes.bottom.n}** **ADC**-Spiele \n **${gamemodes[indexN].lanes.support.n}** **Supporter**-Spiele`;
                soloduochampid = [];
                champnames = [];
                for(let i = 0; i < Object.keys(gamemodes[indexN].champions.all).length; i++) {
                    let soloduodata = Object.values(gamemodes[indexN].champions.all)[i];
                    soloduochampid.push(Object.keys(gamemodes[indexN].champions.all)[i]);
                    for(let j = 0; j < Object.values(champions.data).length; j++) {
                        if(Object.values(champions.data)[j].key == soloduochampid[i]) {
                            champnames.push(Object.values(champions.data)[j].name);
                            break;
                        }
                    }
                    let soloduochampdata = {
                        name: champnames[i],
                        stats: soloduodata
                    }
                    soloduo.push(soloduochampdata);
                }
                soloduo.sort(function(a, b) {
                    var keyA = a.stats.n,
                        keyB = b.stats.n;
                    if (keyA > keyB) return -1;
                    if (keyA < keyB) return 1;
                    return 0;
                });
            } else {
                soloduolanes = `${leaveemoji} Es liegen für diesen Nutzer keine Solo/Duo-Queue Daten vor.`;
            }
            if(soloduo[0] != undefined && soloduo.length > 0) {
                soloduofirstname = `${soloduo[0].name}`;
                soloduofirst = `Gespielt: **${soloduo[0].stats.n}** \n Gewonnen: **${soloduo[0].stats.w}** \n Winrate: **${Math.round((soloduo[0].stats.w/soloduo[0].stats.n)*100)}%** \n Durschnittliche KDA: **${Math.round(((soloduo[0].stats.k+soloduo[0].stats.a)/soloduo[0].stats.d)*100)/100}** \n **${Math.round(((soloduo[0].stats.k)/soloduo[0].stats.n)*100)/100}/${Math.round(((soloduo[0].stats.d)/soloduo[0].stats.n)*100)/100}/${Math.round(((soloduo[0].stats.a)/soloduo[0].stats.n)*100)/100}** \n Durchschnittliche CS: **${Math.round((soloduo[0].stats.cs/soloduo[0].stats.n)*100)/100}**`;
            } else {
                soloduofirst = `\u200b`;
                soloduofirstname = `${leaveemoji} Keine Stats gefunden.`;
            }
            if(soloduo[1] != undefined && soloduo.length > 0) {
                soloduosecondname = `${soloduo[1].name}`;
                soloduosecond = `Gespielt: **${soloduo[1].stats.n}** \n Gewonnen: **${soloduo[1].stats.w}** \n Winrate: **${Math.round((soloduo[1].stats.w/soloduo[1].stats.n)*100)}%** \n Durschnittliche KDA: **${Math.round(((soloduo[1].stats.k+soloduo[1].stats.a)/soloduo[1].stats.d)*100)/100}** \n **${Math.round(((soloduo[1].stats.k)/soloduo[1].stats.n)*100)/100}/${Math.round(((soloduo[1].stats.d)/soloduo[1].stats.n)*100)/100}/${Math.round(((soloduo[1].stats.a)/soloduo[1].stats.n)*100)/100}** \n Durchschnittliche CS: **${Math.round((soloduo[1].stats.cs/soloduo[1].stats.n)*100)/100}**`;
            } else {
                soloduosecond = `\u200b`
                soloduosecondname = `${leaveemoji} Keine Stats gefunden.`
            }
            if(soloduo[2] != undefined && soloduo.length > 0) {
                soloduothirdname = `${soloduo[2].name}`;
                soloduothird = `Gespielt: **${soloduo[2].stats.n}** \n Gewonnen: **${soloduo[2].stats.w}** \n Winrate: **${Math.round((soloduo[2].stats.w/soloduo[2].stats.n)*100)}%** \n Durschnittliche KDA: **${Math.round(((soloduo[2].stats.k+soloduo[2].stats.a)/soloduo[2].stats.d)*100)/100}** \n **${Math.round(((soloduo[2].stats.k)/soloduo[2].stats.n)*100)/100}/${Math.round(((soloduo[2].stats.d)/soloduo[2].stats.n)*100)/100}/${Math.round(((soloduo[2].stats.a)/soloduo[2].stats.n)*100)/100}** \n Durchschnittliche CS: **${Math.round((soloduo[2].stats.cs/soloduo[2].stats.n)*100)/100}**`;
            } else {
                soloduothird = `\u200b`
                soloduothirdname = `${leaveemoji} Keine Stats gefunden.`
            }
            if(Object.keys(Object.values(getKDA)[0]).includes("440")) {
                let indexN = Object.keys(Object.values(getKDA)[0]).indexOf("440");
                flexlanes = `${interaction.options.get('spielername').value} hat in Flex-Queue \n **${gamemodes[indexN].lanes.top.n}** **Toplaner**-Spiele \n **${gamemodes[indexN].lanes.jungle.n}** **Jungler**-Spiele \n **${gamemodes[indexN].lanes.middle.n}** **Midlaner**-Spiele \n **${gamemodes[indexN].lanes.bottom.n}** **ADC**-Spiele \n **${gamemodes[indexN].lanes.support.n}** **Supporter**-Spiele`;
                flexchampid = [];
                champnames = [];
                for(let i = 0; i < Object.keys(gamemodes[indexN].champions.all).length; i++) {
                    let flexdata = Object.values(gamemodes[indexN].champions.all)[i];
                    flexchampid.push(Object.keys(gamemodes[indexN].champions.all)[i]);
                    for(let j = 0; j < Object.values(champions.data).length; j++) {
                        if(Object.values(champions.data)[j].key == flexchampid[i]) {
                            champnames.push(Object.values(champions.data)[j].name);
                            break;
                        }
                    }
                    let flexchampdata = {
                        name: champnames[i],
                        stats: flexdata
                    }
                    flex.push(flexchampdata);
                }
                flex.sort(function(a, b) {
                    var keyA = a.stats.n,
                        keyB = b.stats.n;
                    if (keyA > keyB) return -1;
                    if (keyA < keyB) return 1;
                    return 0;
                });
            } else {
                flexlanes = `${leaveemoji} Es liegen für diesen Nutzer keine Flex-Queue Daten vor.`;
            }
            if(flex[0] != undefined && flex.length > 0) {
                flexfirstname = `${flex[0].name}`;
                flexfirst = `Gespielt: **${flex[0].stats.n}** \n Gewonnen: **${flex[0].stats.w}** \n Winrate: **${Math.round((flex[0].stats.w/flex[0].stats.n)*100)}%** \n Durschnittliche KDA: **${Math.round(((flex[0].stats.k+flex[0].stats.a)/flex[0].stats.d)*100)/100}** \n **${Math.round(((flex[0].stats.k)/flex[0].stats.n)*100)/100}/${Math.round(((flex[0].stats.d)/flex[0].stats.n)*100)/100}/${Math.round(((flex[0].stats.a)/flex[0].stats.n)*100)/100}** \n Durchschnittliche CS: **${Math.round((flex[0].stats.cs/flex[0].stats.n)*100)/100}**`;
            } else {
                flexfirst = `\u200b`;
                flexfirstname = `${leaveemoji} Keine Stats gefunden.`;
            }
            if(flex[1] != undefined && flex.length > 0) {
                flexsecondname = `${flex[1].name}`;
                flexsecond = `Gespielt: **${flex[1].stats.n}** \n Gewonnen: **${flex[1].stats.w}** \n Winrate: **${Math.round((flex[1].stats.w/flex[1].stats.n)*100)}%** \n Durschnittliche KDA: **${Math.round(((flex[1].stats.k+flex[1].stats.a)/flex[1].stats.d)*100)/100}** \n **${Math.round(((flex[1].stats.k)/flex[1].stats.n)*100)/100}/${Math.round(((flex[1].stats.d)/flex[1].stats.n)*100)/100}/${Math.round(((flex[1].stats.a)/flex[1].stats.n)*100)/100}** \n Durchschnittliche CS: **${Math.round((flex[1].stats.cs/flex[1].stats.n)*100)/100}**`;
            } else {
                flexsecond = `\u200b`
                flexsecondname = `${leaveemoji} Keine Stats gefunden.`
            }
            if(flex[2] != undefined && flex.length > 0) {
                flexthirdname = `${flex[2].name}`;
                flexthird = `Gespielt: **${flex[2].stats.n}** \n Gewonnen: **${flex[2].stats.w}** \n Winrate: **${Math.round((flex[2].stats.w/flex[2].stats.n)*100)}%** \n Durschnittliche KDA: **${Math.round(((flex[2].stats.k+flex[2].stats.a)/flex[2].stats.d)*100)/100}** \n **${Math.round(((flex[2].stats.k)/flex[2].stats.n)*100)/100}/${Math.round(((flex[2].stats.d)/flex[2].stats.n)*100)/100}/${Math.round(((flex[2].stats.a)/flex[2].stats.n)*100)/100}** \n Durchschnittliche CS: **${Math.round((flex[2].stats.cs/flex[2].stats.n)*100)/100}**`;
            } else {
                flexthird = `\u200b`
                flexthirdname = `${leaveemoji} Keine Stats gefunden.`
            }
        } catch(e) {
            console.log(e);
            normallanes = `${leaveemoji} Es liegen für diesen Nutzer keine Normals Daten vor.`;
            soloduolanes = `${leaveemoji} Es liegen für diesen Nutzer keine Normals Daten vor.`;
            flexlanes = `${leaveemoji} Es liegen für diesen Nutzer keine Normals Daten vor.`;
            normalfirst = `\u200b`;
            normalfirstname = `${leaveemoji} Keine Stats gefunden.`;
            normalsecond = `\u200b`
            normalsecondname = `${leaveemoji} Keine Stats gefunden.`
            normalthird = `\u200b`
            normalthirdname = `${leaveemoji} Keine Stats gefunden.`
            soloduofirst = `\u200b`;
            soloduofirstname = `${leaveemoji} Keine Stats gefunden.`;
            soloduosecond = `\u200b`
            soloduosecondname = `${leaveemoji} Keine Stats gefunden.`
            soloduothird = `\u200b`
            soloduothirdname = `${leaveemoji} Keine Stats gefunden.`
            flexfirst = `\u200b`;
            flexfirstname = `${leaveemoji} Keine Stats gefunden.`;
            flexsecond = `\u200b`
            flexsecondname = `${leaveemoji} Keine Stats gefunden.`
            flexthird = `\u200b`
            flexthirdname = `${leaveemoji} Keine Stats gefunden.`
        }
        if(flexstring === undefined || flexstring === "undefined") {
            flexstring = `${leaveemoji} Keine Ranglistendaten gefunden`;
        }
        if(solostring === undefined || solostring === "undefined") {
            solostring = `${leaveemoji} Keine Ranglistendaten gefunden`;
        }
        const embeduserprofile = new MessageEmbed()
            .setColor(`${color}`)
            .setTitle(`Stats für ${summoner.response.name}`)
            .setDescription(`Spielername: **${summoner.response.name}** \n Level: **${summoner.response.summonerLevel}**`)
            .addFields(
            {
                name: `\u200b`,
                value: `**Rangliste**`,
            },
            {
                name: `Solo/Duo-Queue`,
                value: `${solostring}`,
                inline: true,
            },
            {
                name: `Flex-Queue`,
                value: `${flexstring}`,
                inline: true,
            },
            )
            .addFields(
            {
                name:`\u200b`,
                value: `**MMR**`,
            },
            {
                name:`Ranglisten MMR`,
                value: `${rankedmmr}`,
                inline: true,
            },
            {
                name:`Normal MMR`,
                value: `${normalmmr}`,
                inline: true,
            },
            {
                name:`ARAM MMR`,
                value: `${arammmr}`,
                inline: true,
            },
            )
            .addFields(
            {
                name:`\u200b`,
                value: `**Laneverteilung**`,
            },
            {
                name:`Normal`,
                value: `${normallanes}`,
                inline: true,
            },
            {
                name:`Solo/Duo-Queue`,
                value: `${soloduolanes}`,
                inline: true,
            },
            {
                name:`Flex-Queue`,
                value: `${flexlanes}`,
                inline: true,
            },
            )
            .setURL(`https://xdx.gg/${queryregion}/${encodeURI(interaction.options.get("spielername").value)}`)
            .setThumbnail(`https://ddragon.leagueoflegends.com/cdn/${getVersion[0]}/img/profileicon/${summoner.response.profileIconId}.png`)
            .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);

            const embeduserprofile2 = new MessageEmbed()
            .setColor(`${color}`)
            .setTitle(`Stats für ${summoner.response.name}`)
            .addFields(
            {   
                name: `\u200b`,
                value: `**Top 3 Champs - Höchste Meisterschaftspunkte**`,
            },
            {
                name: `${topthreechampsMastery[0].name}`,
                value: `Masterylevel **${championsMastery[0].championLevel}** \n Masterypoints \n **${championsMastery[0].championPoints}**`,
                inline: true,
            },
            {
                name: `${topthreechampsMastery[1].name}`,
                value: `Masterylevel **${championsMastery[1].championLevel}** \n Masterypoints \n **${championsMastery[1].championPoints}**`,
                inline: true,
            },
            {
                name: `${topthreechampsMastery[2].name}`,
                value: `Masterylevel **${championsMastery[2].championLevel}** \n Masterypoints \n **${championsMastery[2].championPoints}**`,
                inline: true,
            },
            )
            .addFields(
            {
                name: `\u200b`,
                value: `**Top 3 Champs in Normals - Am häufigsten gespielt**`,
            },
            {
                name: `${normalfirstname}`,
                value: `${normalfirst}`,
                inline: true,
            },
            {
                name: `${normalsecondname}`,
                value: `${normalsecond}`,
                inline: true,
            },
            {
                name: `${normalthirdname}`,
                value: `${normalthird}`,
                inline: true,
            },
            )
            .addFields(
            {
                name: `\u200b`,
                value: `**Top 3 Champs in Solo/Duo-Queue - Am häufigsten gespielt**`,
            },
            {
                name: `${soloduofirstname}`,
                value: `${soloduofirst}`,
                inline: true,
            },
            {
                name: `${soloduosecondname}`,
                value: `${soloduosecond}`,
                inline: true,
            },
            {
                name: `${soloduothirdname}`,
                value: `${soloduothird}`,
                inline: true,
            },
            )
            .addFields(
            {
                name: `\u200b`,
                value: `**Top 3 Champs in Flex-Queue - Am häufigsten gespielt**`,
            },
            {
                name: `${flexfirstname}`,
                value: `${flexfirst}`,
                inline: true,
            },
            {
                name: `${flexsecondname}`,
                value: `${flexsecond}`,
                inline: true,
            },
            {
                name: `${flexthirdname}`,
                value: `${flexthird}`,
                inline: true,
            },
            )
            .setURL(`https://xdx.gg/${queryregion}/${encodeURI(interaction.options.get("spielername").value)}`)
            .setThumbnail(`https://ddragon.leagueoflegends.com/cdn/${getVersion[0]}/img/profileicon/${summoner.response.profileIconId}.png`)
            .setFooter(`Ausgeführt von:  ${nick}`, `${userpp}`);

        const button1 = new MessageButton()
        .setCustomId('previousbtn')
        .setEmoji(`${backemoji}`)
        .setStyle('SECONDARY');

        const button2 = new MessageButton()
        .setCustomId('nextbtn')
        .setEmoji(`${skipemoji}`)
        .setStyle('SECONDARY');

        buttonList = [ button1, button2 ];
        
        embedpages = [ embeduserprofile, embeduserprofile2 ];

        const timeout = 30000;

        paginationEmbed.interactionEmbed(interaction, embedpages, buttonList, timeout);
    },
};