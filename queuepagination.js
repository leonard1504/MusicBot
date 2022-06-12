///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Dependencies //////////////////////////////////////////////////////////////////////////////////////////////////////////
const {
  MessageActionRow,
  Message,
  MessageEmbed,
  MessageButton,
} = require("discord.js");
const { backemoji, skipemoji } = require("./config.json");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Params ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @param {Interaction} interaction
 * @param {Message} message
 * @param {MessageEmbed[]} pages
 * @param {MessageButton[]} buttonList
 * @param {number} timeout
 * @returns
*/
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Interaction pagination ////////////////////////////////////////////////////////////////////////////////////////////////
const interactionEmbed = async (interaction, pages, buttonList, timeout = 120000) => {
  if (!pages) throw new Error("Pages are not given.");
  if (!buttonList) throw new Error("Buttons are not given.");
  if (buttonList[2] === undefined) {
    if (buttonList[0].style === "LINK" || buttonList[1].style === "LINK")
      throw new Error(
        "Link buttons are not supported with @acegoal07/discordjs-pagination"
      );
  } else {
    if (buttonList[0].style === "LINK" || buttonList[1].style === "LINK" || buttonList[2].style === "LINK")
      throw new Error(
        "Link buttons are not supported with @acegoal07/discordjs-pagination"
      );
  }
  if (buttonList.length < 2) throw new Error("Need two buttons");

  let page = 0;

  const row = new MessageActionRow().addComponents(buttonList);
  const curPage = await interaction.reply({
    embeds: [pages[page]],
    components: [row],fetchReply: true,
  });

  let filter 
  if (buttonList[2] === undefined) {
    filter = (i) =>
      i.customId === buttonList[0].customId ||
      i.customId === buttonList[1].customId;
  } else {
    filter = (i) =>
      i.customId === buttonList[0].customId ||
      i.customId === buttonList[1].customId ||
      i.customId === buttonList[2].customId;
  }
  
  const collector = await curPage.createMessageComponentCollector({
    filter,
    time: timeout,
  });

  collector.on("collect", async (i) => {
    switch (i.customId) {
      case buttonList[0].customId:
        page = page > 0 ? --page : pages.length - 1;
        break;
      case buttonList[1].customId:
        page = page + 1 < pages.length ? ++page : 0;
        break;
      case buttonList[2].customId:
        curPage.delete();
        return;
      default:
        break;
    }
    await i.deferUpdate();
    await i.editReply({
      embeds: [pages[page]],
      components: [row],
    });
    collector.resetTimer();
  });

  collector.on("end", async() => {
    try {
      if (!curPage.deleted) {
        try {
          if (buttonList[2] === undefined) {
            const disablebuttons = new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setCustomId('previousbtn')
                .setEmoji(`${backemoji}`)
                .setDisabled(true)
                .setStyle('SECONDARY'),
              new MessageButton()
                .setCustomId('nextbtn')
                .setEmoji(`${skipemoji}`)
                .setDisabled(true)
                .setStyle('SECONDARY'),
              );
              curPage.edit({ components: [disablebuttons] });
          } 
          if (buttonList[2]) {
            const disablebuttons = new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setCustomId('previousbtn')
                .setEmoji(`${backemoji}`)
                .setDisabled(true)
                .setStyle('SECONDARY'),
              new MessageButton()
                .setCustomId('nextbtn')
                .setEmoji(`${skipemoji}`)
                .setDisabled(true)
                .setStyle('SECONDARY'),
              );
              curPage.edit({ components: [disablebuttons] });
          } 
        } catch(error) {return}
      }
    } catch(error) {return}
  });
  return curPage;
};

const interactionLyricsEmbed = async (interaction, pages, buttonList, timeout = 120000) => {
  if (!pages) throw new Error("Pages are not given.");
  if (!buttonList) throw new Error("Buttons are not given.");
  if (buttonList[2] === undefined) {
    if (buttonList[0].style === "LINK" || buttonList[1].style === "LINK")
      throw new Error(
        "Link buttons are not supported with @acegoal07/discordjs-pagination"
      );
  } else {
    if (buttonList[0].style === "LINK" || buttonList[1].style === "LINK" || buttonList[2].style === "LINK")
      throw new Error(
        "Link buttons are not supported with @acegoal07/discordjs-pagination"
      );
  }
  if (buttonList.length < 2) throw new Error("Need two buttons");

  let page = 0;

  const row = new MessageActionRow().addComponents(buttonList);
  const curPage = await interaction.channel.send({
    embeds: [pages[page]],
    components: [row],fetchReply: true,
  });

  let filter 
  if (buttonList[2] === undefined) {
    filter = (i) =>
      i.customId === buttonList[0].customId ||
      i.customId === buttonList[1].customId;
  } else {
    filter = (i) =>
      i.customId === buttonList[0].customId ||
      i.customId === buttonList[1].customId ||
      i.customId === buttonList[2].customId;
  }
  
  const collector = await curPage.createMessageComponentCollector({
    filter,
    time: timeout,
  });

  collector.on("collect", async (i) => {
    switch (i.customId) {
      case buttonList[0].customId:
        page = page > 0 ? --page : pages.length - 1;
        break;
      case buttonList[1].customId:
        page = page + 1 < pages.length ? ++page : 0;
        break;
      case buttonList[2].customId:
        curPage.delete();
        return;
      default:
        break;
    }
    await i.deferUpdate();
    await i.editReply({
      embeds: [pages[page]],
      components: [row],
    });
    collector.resetTimer();
  });

  collector.on("end", async() => {
    try {
      if (!curPage.deleted) {
        try {
          if (buttonList[2] === undefined) {
            const disablebuttons = new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setCustomId('previousbtn')
                .setEmoji(`${backemoji}`)
                .setDisabled(true)
                .setStyle('SECONDARY'),
              new MessageButton()
                .setCustomId('nextbtn')
                .setEmoji(`${skipemoji}`)
                .setDisabled(true)
                .setStyle('SECONDARY'),
              );
              curPage.edit({ components: [disablebuttons] });
          } 
          if (buttonList[2]) {
            const disablebuttons = new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setCustomId('previousbtn')
                .setEmoji(`${backemoji}`)
                .setDisabled(true)
                .setStyle('SECONDARY'),
              new MessageButton()
                .setCustomId('nextbtn')
                .setEmoji(`${skipemoji}`)
                .setDisabled(true)
                .setStyle('SECONDARY'),
              );
              curPage.edit({ components: [disablebuttons] });
          } 
        } catch(error) {return}
      }
    } catch(error) {return}
  });
  return curPage;
};

const interactionHelpEmbed = async (interaction, pages, buttonList, timeout = 120000) => {
  if (!pages) throw new Error("Pages are not given.");
  if (!buttonList) throw new Error("Buttons are not given.");
  if (buttonList[2] === undefined) {
    if (buttonList[0].style === "LINK" || buttonList[1].style === "LINK")
      throw new Error(
        "Link buttons are not supported with @acegoal07/discordjs-pagination"
      );
  } else {
    if (buttonList[0].style === "LINK" || buttonList[1].style === "LINK" || buttonList[2].style === "LINK")
      throw new Error(
        "Link buttons are not supported with @acegoal07/discordjs-pagination"
      );
  }
  if (buttonList.length < 2) throw new Error("Need two buttons");

  let page = 0;

  const row = new MessageActionRow().addComponents(buttonList);
  interaction.reply("https://cdn.discordapp.com/attachments/899988196388118638/982025529127497728/hilfemenue.png");
  const curPage = await interaction.channel.send({
    embeds: [pages[page]],
    components: [row],fetchReply: true,
  });

  let filter 
  if (buttonList[2] === undefined) {
    filter = (i) =>
      i.customId === buttonList[0].customId ||
      i.customId === buttonList[1].customId;
  } else {
    filter = (i) =>
      i.customId === buttonList[0].customId ||
      i.customId === buttonList[1].customId ||
      i.customId === buttonList[2].customId;
  }
  
  const collector = await curPage.createMessageComponentCollector({
    filter,
    time: timeout,
  });

  collector.on("collect", async (i) => {
    switch (i.customId) {
      case buttonList[0].customId:
        page = page > 0 ? --page : pages.length - 1;
        break;
      case buttonList[1].customId:
        page = page + 1 < pages.length ? ++page : 0;
        break;
      case buttonList[2].customId:
        curPage.delete();
        return;
      default:
        break;
    }
    await i.deferUpdate();
    await i.editReply({
      embeds: [pages[page]],
      components: [row],
    });
    collector.resetTimer();
  });

  collector.on("end", async() => {
    try {
      if (!curPage.deleted) {
        try {
          if (buttonList[2] === undefined) {
            const disablebuttons = new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setCustomId('previousbtn')
                .setEmoji(`${backemoji}`)
                .setDisabled(true)
                .setStyle('SECONDARY'),
              new MessageButton()
                .setCustomId('nextbtn')
                .setEmoji(`${skipemoji}`)
                .setDisabled(true)
                .setStyle('SECONDARY'),
              );
              curPage.edit({ components: [disablebuttons] });
          } 
          if (buttonList[2]) {
            const disablebuttons = new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setCustomId('previousbtn')
                .setEmoji(`${backemoji}`)
                .setDisabled(true)
                .setStyle('SECONDARY'),
              new MessageButton()
                .setCustomId('nextbtn')
                .setEmoji(`${skipemoji}`)
                .setDisabled(true)
                .setStyle('SECONDARY'),
              );
              curPage.edit({ components: [disablebuttons] });
          } 
        } catch(error) {return}
      }
    } catch(error) {return}
  });
  return curPage;
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Exporter //////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = { interactionEmbed, interactionLyricsEmbed, interactionHelpEmbed };