const GUIMessages = require.main.require('./templates/messages');
const { Command } = require('discord-akairo');
const emotes={error:":warning:"}
const {reactions,defaultAvatar} = require.main.require('./common');
const common = require.main.require('./common');
const commandVars = common.commandVars(__filename);
const _ = require('lodash');
const path = require('path');
const util = require.main.require('./util');

class CustomCommand extends Command {
	constructor() {
		super(commandVars.name, {
		description: { content: 'plays all of a subreddit [subreddit]. You can combine subreddits via `+` or ` `'},
		aliases: [commandVars.name],
		category: commandVars.category,
		clientPermissions: ['SEND_MESSAGES'],
		args: [
			{
				id: 'search',
				default: '',
				match: 'content',
			},
			],
		channelRestriction: 'guild', 
		});
	}
	
	userPermissions(message) {
		if (!message.member.roles.cache.some(role => role.name === 'DJ')) {
			return 'DJ';
		}
		return null;
	}
	
	requirements(message,player){
		let blocked = '';
		if (!message.member.voice.channel) blocked = `${emotes.error} - You're not in a voice channel !`;
		if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) blocked = `${emotes.error} - You are not in the same voice channel !`;
		//if(!player){blocked = 'No player currently playing';}
		if(blocked){
			this.handler.emit('commandBlocked',message,this,blocked);
		}
		return blocked;
	}
	
	async exec(message, { search }) {
		if(this.requirements(message)){
			return;
		}
		var player = this.client.memory.channelGet(message, 'player') || this.client.memory.channelSet(message, 'player', util.player.create(message,this.client));
		
		var queue=player.getQueue(message);
		if(queue){
			if(queue.paused || queue.stopped){
				if(player.resume(message)){
					await GUIMessages.nowPlaying(message,player,"Continuing where we left off "+common.randomMusicEmoji());
					return
				}else{
					let track = player.nowPlaying(message);
					if(track){
						await player.play(message,player.nowPlaying(message));
					}else{
						//do background
						await util.player.playBackgroundPlaylist(message,player);
					}
				}
				return //it was paused or stopped so we should have fixed it by now
			}
		}
		if(player.isPlaying(message)){
			if(!search && !message.attachments){
				return message.channel.send(`${emotes.error} - Please indicate the title of a song!`);
			}
		}else{
			if(!search && !message.attachments){
				await util.player.play
				Playlist(message,player);
				return
			}
		}
		
			

		if(message.attachments){
			await player.play(message, search, { isAttachment:true });
		}else{
			await player.play(message, search, { firstResult: true });
		}
		//The player was originallly in background mode
		//so advance past the backgroud music and start playing the users' requests
		if(player.backgroundPlaylist){
			player.backgroundPlaylist=false;
			await player.skip(message);
		}
	}
}

module.exports = CustomCommand;