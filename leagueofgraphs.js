const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin());
url = "https://www.leagueofgraphs.com/de/summoner/champions/euw/Pepperoni1905#championsData-all-queues";

async function test() {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox"],
        ignoreDefaultArgs: ['--disable-extensions']
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({
        width: 1920,
        height: 1080
    });
    await page.setDefaultTimeout(10000);
    await page.waitForSelector("button.ncmp__btn");
    const selectors = await page.$$('button.ncmp__btn')
    await selectors[1].click();

    const tables_all_queues = await page.$$("div.content.active tr td span, div.content.active tr td div.progressBarTxt, div.content.active tr td.text-center a.full-cell");
    let regex1 = "/<(?<=<).*(?=>)>/g";
    let regex2 = "/[^A-Za-z\.0-9]+/g";
    let champs = [];
    let i = 0;
    let getChamp, champName, champRounds, champWR, champKDA, champKills, champDeaths, champAssists, champCSPMin, champGPM, champPenta;
    for(const div of tables_all_queues) {
        getChamp = await page.evaluate(el => el.textContent, div);
        /*switch(i) {
            case 0:
                champName = getChamp.replace(regex2, "");
                break;
            case 1:
                champRounds = getChamp;
                break;
            case 2:
                champWR = getChamp;
                break;
            case 4:
                champKills = getChamp;
                break;
            case 5:
                champDeaths = getChamp;
                break;
            case 6:
                champAssists = getChamp;
                break;
            case 7:
                champCSPMin = getChamp.replace(regex2, "");
                break;
            case 8: 
                champGPM = getChamp.replace(regex2, "");
                break;
            case 9:
                champPenta = getChamp.replace(regex2, "");
                break;
            default:
                break;
        }
        if(i === 9) {
            champStats = {
                name: champName,
                rounds: champRounds,
                wr: champWR,
                kills: champKills,
                deaths: champDeaths,
                assists: champAssists,
                cs: champCSPMin,
                gpm: champGPM,
                penta: champPenta
            };
            champs.push(champStats);
            i = 0; 
        }*/
        i++;
        console.log(i + ". " + getChamp);
    }

    console.log(champs);

    /*let classNames = [];
    for(const div of await page.$$('div')) {
        let div_class = await div._remoteObject.description;
        if(div_class !== "" && div_class !== "div") {
            console.log(div_class);
        }
    };*/
    await browser.close();
}

test();