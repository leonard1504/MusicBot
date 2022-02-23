const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    MessageEmbed
} = require('discord.js');
const {
    color
} = require('../config.json');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('movemeback')
        .addChannelOption(option => option.setName('channel').setDescription('Gebe hier den Channel an in den du zurück gemoved werden willst').setRequired(true))
        .addBooleanOption(option => option.setName('onoff').setRequired(true).setDescription('Schalte das Feature ein oder aus'))
        .setDescription('Moved dich zurück in den Channel den du angibst'),
    async execute(interaction) {
        if (interaction.member.nickname != null) {
            nick = interaction.member.nickname;
        } else {
            nick = interaction.user.username;
        }
        //Initializing variables
        userfound = false;
        movemeback = {};
        userpp = interaction.user.avatarURL();
        channelid = interaction.options.get('channel').value;
        onoff = interaction.options.get('onoff').value;
        userdatabase = [];
		//Read database
		fs.access('movemeback.json', (err) => {
			if(!err) {
                let file = fs.statSync('movemeback.json');
				if(file.size > 0) {
                    fs.readFile('movemeback.json', 'utf-8', (err, data1) => {
                        userdatabase = JSON.parse(data1.toString());
                    });
                }
			}
		});

        for(let i = 0; userdatabase.length > i; i++) {
            if(userdatabase[i].user_id === interaction.user.id) {
                userfound = true;
                if(userdatabase[i].on !== onoff || userdatabase[i].channel_id !== channelid) {
                    movemeback = {
                        user_id: interaction.user.id,
                        channel_id: channelid,
                        channel_name: interaction.options.get('channel').channel.name,
                        on: onoff
                    }
                    userdatabase.push(movemeback);
                    const data2 = JSON.stringify(userdatabase);
                    fs.writeFile(`movemeback.json`, data2, (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log("Update user preferences");
                    });
                }
            }
        }
        if(!userfound) {
            movemeback = {
                user_id: interaction.user.id,
                channel_id: channelid,
                channel_name: interaction.options.get('channel').channel.name,
                on: onoff
            }
            userdatabase.push(movemeback);
            const data2 = JSON.stringify(userdatabase);
            fs.writeFile(`movemeback.json`, data2, (err) => {
                if (err) {
                    throw err;
                }
                console.log("User not found creating new entry");
            });
        }
        const embedmmbon = new MessageEmbed()
            .setColor(`${color}`)
            .setDescription(`Du (**${nick}**) wirst nun immer wieder nach **${interaction.options.get('channel').channel.name}** zurück gemoved, bis du dich vom Voice-Chat trennst`)
            .setFooter(`\nAusgeführt von:  ${nick}`, `${userpp}`);
        const embedmmboff = new MessageEmbed()
            .setColor(`${color}`)
            .setDescription(`Du (**${nick}**) wirst nun nicht mehr nach **${interaction.options.get('channel').channel.name}** zurück gemoved`)
            .setFooter(`\nAusgeführt von:  ${nick}`, `${userpp}`);
        console.log(movemeback);
        if(movemeback.on) {
            await interaction.reply({
                embeds: [embedmmbon],
                ephemeral: true
            });
        } else if(!movemeback.on) {
            await interaction.reply({
                embeds: [embedmmboff],
                ephemeral: true
            });
        }
        console.log(userdatabase);
    },
};