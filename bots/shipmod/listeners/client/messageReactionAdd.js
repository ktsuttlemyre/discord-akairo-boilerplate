// howto
//https://discordjs.guide/popular-topics/reactions.html#listening-for-reactions-on-old-messages
// code example
//https://github.com/discordjs/guide/blob/master/code-samples/popular-topics/reactions/12/uncached-messages.js
const { MessageEmbed } = require('discord.js');
const { Listener } = require('discord-akairo');
const config = require.main.require('./config');
const commandVars = require.main.require('./common').commandVars(__filename);
const util = require.main.require('./util');
const _ = require('lodash');


class CustomListener extends Listener {
	constructor() {
		super(commandVars.name, {
			emitter: commandVars.category,
			event: commandVars.name,
			category: commandVars.category,
		});
	}


	async exec( reaction, user ) {
		if(user.bot){
			return
		}


 		//this is off because it is probably a bad idea to use a partial before calling .fetch()
		//let optomized = false;
		// if(optomized){
		// 	if(sendToUser){
		// 		notify = userWantsEmojiNotifications();
		// 		if(notify === false){
		// 			return
		// 		}
		// 	}
		// }


		//make sure message is resolved
		let message = await util.messages.resolve(reaction.message);
		
		let member = message.guild.member(user) || user;
		let name = member.displayName || member.username || member.tag;
		let messageContent=_.truncate(message.content);
		let sendToUser = /*message.guild.member(message.member.user) ||*/ message.member;
		
		console.log(`${name} reacted with "${reaction.emoji.name}" to ${sendToUser.displayName}'s ${message.id} with content ${messageContent}.`);

		
		
			
		//render
		let embed = new MessageEmbed();
		embed.setAuthor(name, user.displayAvatarURL() || common.defaultAvatar, `https://discordapp.com/users/${user.id}`);
		embed.setDescription(`Reacted with ${reaction.emoji.name} to your message ${messageContent}`);
		//sendToUser.send(embed);
			
		let logChannel=message.guild.channels.cache.get('800748408741953576');
		if(logChannel){
			logChannel.send(embed);
		}
		
		//see if user wants notificaiton
		let notify = (sendToUser.roles.cache.find(r => r.name === "ReceiveReactAlert"));
		notify && sendToUser.send(embed);
	}
}
module.exports = CustomListener;
