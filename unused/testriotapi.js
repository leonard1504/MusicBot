const { riotapikey } = require('../config.json');
const { LolApi, Constants } = require('twisted');
const puppeteer = require('puppeteer');
const url = 'https://euw.op.gg/multi/query=MagicalKyoko%2C%20Fetzι%2C%20Pepperoni1905%2C%20dobbenheimer';

const api = new LolApi({ key: `${riotapikey}`, rateLimitRetry: true, rateLimitRetryAttempts: 1});
let last500Matches = [];
let last500MatchesInfo = [];

async function Matches() {
    const getSummoner = await api.Summoner.getByName("Fetzι", Constants.Regions.EU_WEST);
    for(let i = 0; i < 5; i++) {
        const getAllMatches = await api.MatchV5.list(getSummoner.response.puuid, Constants.RegionGroups.EUROPE, {count: 100, start: `${i}00` });
        if(getAllMatches.response.length > 0) {
            last500Matches.push(getAllMatches.response);
        } else {
            break;
        }
    }
    let mergeLast500Matches = [].concat.apply([], last500Matches);
    for(let j = 0; j < 500; j++) {
        const getAllMatchInfo = await api.MatchV5.get(mergeLast500Matches[j], Constants.RegionGroups.EUROPE);
        if(getAllMatchInfo.response.info != undefined) {
            last500MatchesInfo.push(getAllMatchInfo.response);
        } else {
            break;
        }
    }
    let mergeLast500MatchesInfo = [].concat.apply([], last500MatchesInfo);
    console.log(mergeLast500MatchesInfo);
}
//Matches();

async function getMatchInfobyID(id) {
    const getMatchInfobyID = await api.MatchV5.get(id, Constants.RegionGroups.EUROPE);
    console.log(getMatchInfobyID);
}
//getMatchInfobyID("EUW1_4974263709");

async function getLiveMatchData(summonername, region) {
    const getSummoner = await api.Summoner.getByName(summonername, region);
    const liveMatch = await api.Spectator.activeGame(getSummoner.response.id, region);
    console.log(liveMatch.response);
}
//getLiveMatchData("Tollkühn", Constants.Regions.EU_WEST);

const Screenshot = async () => {                // Define Screenshot function
 
    const browser = await puppeteer.launch();    // Launch a "browser"
  
    const page = await browser.newPage();        // Open a new page
  
    await page.goto(url); 
    await page.waitForSelector('.css-1ey59fx');
    await page.click('.css-1ey59fx');             // Go to the website
    
    await page.waitForSelector('.multi2__list');          // wait for the selector to load
    const element = await page.$('.multi2__list');        // declare a variable with an ElementHandle
    const attachment = new MessageAttachment(await element.screenshot(), 'screenshot'); // take screenshot element in puppeteer
    await browser.close();                                             // Close the browser
 }
  
 Screenshot();  