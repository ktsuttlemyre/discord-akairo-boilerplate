const GUIMessages = require.main.require('./templates/messages');
const { Command } = require('discord-akairo');
const { Player } = require("discord-player");
const emotes={error:":error:"}
const {reactions,defaultAvatar} = require.main.require('./common');
const common = require.main.require('./common');
var _ = require('lodash');
var map = require.main.require('./sounds')


//sound effects https://www.youtube.com/channel/UCok6P4rwxBMun9ghaIV4ufQ

class CustomCommand extends Command {
	constructor() {
		super('clip', {
		description: { content: 'clip'},
		aliases: ['clip','sound'],
		category: 'tunes',
		clientPermissions: ['SEND_MESSAGES'],
		args: [
			{
				id: 'arg',
				default: '',
				match: 'content',
			},
			],
		channelRestriction: 'guild', 
		});
	}
	
// 	userPermissions(message) {
// 		if (!message.member.roles.cache.some(role => role.name === 'DJ')) {
// 			return 'DJ';
// 		}
// 		return null;
// 	}

	async exec(message, {arg}) {
		if (!message.member.voice.channel) return message.channel.send(`${emotes.error} - You're not in a voice channel !`);
		if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${emotes.error} - You are not in the same voice channel !`);
// 		var player = this.client.memory.get(message.guild, 'player')
// 		if(!player){
// 			return message.channel.send('No player playing to act on')
// 		}
				
 	 	    const { channel } = message.member.voice;
		    console.log('arg',arg)
		    arg = (arg||'').match(/(\<\@\!)?(\d+)(>)?/)[2]||arg;
		    console.log('arg after match',arg);
		    arg = map[arg]||arg;
	            console.log('arg after map',arg)
		    try {
		      var connection = await channel.join();
		      const dispatcher = connection
		        //.play(ytdl('https://www.youtube.com/watch?v=ZlAU_w7-Xp8', { quality: 'highestaudio', volume: 0.5}))
			.play(`./sounds/${arg}.mp3`)
			.on("finish", () => {
			  //channel.leave();
			})
			.on("error", err => {
			  //channel.leave();
			  console.error(err);
			});
		    } catch (error) {
		      console.error(error);
		    }

		}
}

module.exports = CustomCommand;