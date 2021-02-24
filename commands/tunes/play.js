const { MessageEmbed } = require('discord.js');
const { Command } = require('discord-akairo');
const { Player } = require("discord-player");
const emotes={error:":error:"}
const moment = require("moment");

class PlayCommand extends Command {
	constructor() {
		super('play', {
		description: { content: 'plays [name/URL]'},
		aliases: ['play','add','queue'],
		category: 'tunes',
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

	exec(message, { search }) {
		if (!message.member.voice.channel) return message.channel.send(`${emotes.error} - You're not in a voice channel !`);
		if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${emotes.error} - You are not in the same voice channel !`);
		if (!search) return message.channel.send(`${emotes.error} - Please indicate the title of a song !`);
		var player = this.client.memory.get(message.guild, 'player', player)
		if(!player){
			//https://discord-player.js.org/global.html#PlayerOptions
			let options={
				leaveOnEnd:true,
				leaveOnEndCooldown:300,
				leaveOnStop:false,
				leaveOnEmpty:true,
				leaveOnEmptyCooldown:300,	
				autoSelfDeaf:true,
				quality:'high',
				enableLive: true,	    
			}
			player = this.client.memory.set(message.guild, 'player', new Player(this.client,options));
			var match = (player.createProgressBar(message,{queue:true,timecodes:true})||'').match(/(\d|:)+/g);
			var duration=moment.duration('00:00:00');
			if(match.length==2){
				duration = moment.duration(match[1]).diff(moment.duration(match[0]));
			}
			
			
			player.on("trackStart",function(message, track){
				var embedJSON={
				      "title": `${track.title}`,
				      //"description": `Author:${track.author}\n${track.description}`,
				      "description": `Next song:\n${track.queue.tracks[1].title}`,
				      "url": `${track.url}`,
				      "color": 5814783,
				      "fields": [
					{
					  "name": "State:",
					  "value": `:blue_square:${track.queue.repeatMode}  :blue_square:${track.queue.repeatMode}  :blue_square:${track.queue.repeatMode}`,
					  "inline": true
					},
					{
					  "name": "‎",
					  "value": "‎",
					  "inline": true
					},
					{
					  "name": "‎",
					  "value": `Volume:${track.queue.volume}`,
					  "inline": true
					},
					{
					  "name": `Queue:`,
					  "value": ((track.queue.stopped)?':arrow_forward:':':stop_button:')+player.createProgressBar(message,{queue:true,timecodes:false}),
					  "inline": true
					},
					{
					  "name": "‎",
					  "value": 'Remaining\n'+duration.format("HH:mm:ss"),
					  "inline": true
					},
					{
					  "name": "‎",
					  "value": 'Tracks\n'+`${track.queue.tracks.length}`,
					  "inline": true
					}
				      ],
				      "footer": {
					"text": `${track.requestedBy.username} requested this song`,
					"icon_url":  track.requestedBy.avatarURL() //"https://shipwa.sh/img/logo/shipwash_avatar.png"
				      },
				      "thumbnail": {
					"url": `${track.thumbnail}`
				      }
					//image: {
					//  url: `${track.thumbnail}`,
					//},
				}
				message.channel.send({embed:embedJSON})
				//message.channel.send(`Now playing ${track.title} requested by @${track.requestedBy.username} `)
			})
		}
		/*
		//complidated init event to add volume and filters
		if(!player.isPlaying(message)){
			player.on('queueCreate',function(message,queue){
				var init=false
				player.on('trackStart',function(message, track){
					if(init){
						return;
					}
					init=setInterval(function(){
						if(!player.isPlaying(message)){
							return
						}
						try{
							//https://discord-player.js.org/global.html#Filters
							player.setFilters(message, {
							 normalizer: true
							});
							player.setVolume(message, 20);
							clearInterval(init);
						}catch(e){
						}
					},10);
				})
			});
		}*/
		
		if(!message.attachments){
			player.play(message, search, { firstResult: true });
		}else{
			player.play(message, search, { isAttachment:true });
		}
        
        
 /* 
		const embed = new MessageEmbed()
			.setColor(0xFFAC33)
			.setTitle('About Discord Akairo Boilerplate')
			.addField('Creator', [
				'**Discord**: Snipey#0001',
				'**Twitter**: https://twitter.com/snipeydev',
				'**Patreon**: https://patreon.com/snipeydev',
				'**Github**: https://github.com/snipey',
			], true);

		return message.channel.send(embed);
    */
	}
}

module.exports = PlayCommand;

