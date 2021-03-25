const { Player } = require("discord-player");
const GUIMessages = require.main.require('./templates/messages');
const { Command } = require('discord-akairo');
const emotes={error:":warning:"}
const {reactions,defaultAvatar} = require.main.require('./common');
const common = require.main.require('./common');
const _ = require('lodash');
const path = require('path');
const util = require.main.require('./util');
const config = require.main.require('./config');

//if this returns null then it is a hard allow action
//if this returns a string it will be prestented to the user as the missing permission/qualification
//if undefined it will default to allow but can be used by other dynamic permission functions to determine if this rutine explicit gave permission or not
module.exports.commandPermissions=function(message,requireDJ){
	let isDJ = message.member.roles.cache.find(role => role.name === config.DJ_Role)
	//DJ bypass
	if(isDJ){return null}
	let channel = message.member.voice.channel;
	//Check they are in a voice channel
	if (!message.member.voice.channel) return `${emotes.error} - You're not in a voice channel !`;
	//Check they are in the same voice channel as the bot
	if (message.guild.me.voice.channel && channel.id !== message.guild.me.voice.channel.id) return `${emotes.error} - You are not in the same voice channel !`;
	//if the user is the only one in the channel then allow action
	if(channel && channel.members.size==1){
		return null;
	}
	//do voting (optional)

	//isDJ required?
	if (requireDJ && !isDJ){return config.DJ_Role;}
	return undefined;
}

let playBackgroundPlaylist = module.exports.playBackgroundPlaylist = async (message,player,notice) => {
	init(message,player,notice);
	
	let playlistName='chill nintendo beats'
	
	let library={'chill nintendo beats':[
		'https://www.youtube.com/watch?v=oS-A-wqZ2RI',
		'https://www.youtube.com/watch?v=AEuQcjHT_f4',
		'https://www.youtube.com/watch?v=oUHvYOYMNJk',
		'https://www.youtube.com/watch?v=C37VQ99xh6U',
		'https://www.youtube.com/watch?v=3t4qrROblcc',
		'https://www.youtube.com/watch?v=680ETor7pns',
		'https://www.youtube.com/watch?v=e6RHPoLimHI',
		'https://www.youtube.com/watch?v=xTUlPXmclFk',
		'https://www.youtube.com/watch?v=aAw_0a6aHo0',
		'https://www.youtube.com/watch?v=8JEvxdAYjSo',
		'https://www.youtube.com/watch?v=rDcYN1THMZY',
		'https://www.youtube.com/watch?v=SLgms78JVo0',
		'https://www.youtube.com/watch?v=sfyvAQemik4',
		'https://www.youtube.com/watch?v=iXFpdYQTzVo',
		'https://www.youtube.com/watch?v=lqNc1ky_Xoc',
		'https://www.youtube.com/watch?v=p9a-AQQJ8Aw',
		'https://www.youtube.com/watch?v=UkjFV-66E2c',
		'https://www.youtube.com/watch?v=9W9Wg_bp0ns',
		'https://www.youtube.com/watch?v=ZNf0D-BXi18',
		'https://www.youtube.com/watch?v=iJwE7PwJirs',
		'https://www.youtube.com/watch?v=5hZa1jb7MLg',
		'https://www.youtube.com/watch?v=ELljh9xfuuw',
		'https://www.youtube.com/watch?v=dM103L2tErY',
		'https://www.youtube.com/watch?v=CLLC1aPs0-Q',
		'https://www.youtube.com/watch?v=UOaNOZ4_qtw',
		'https://www.youtube.com/watch?v=iRdi1O94BNs',
		'https://www.youtube.com/watch?v=qZGwRz8wnSY',
		'https://www.youtube.com/watch?v=lqNc1ky_Xoc', //https://www.youtube.com/watch?app=desktop&v=lqNc1ky_Xoc&list=PLtSSR9Mvq5GpfHT5kiM8OdJbXsNSL33QG&index=8
		'https://www.youtube.com/watch?v=CNh1uSiAHRQ',
		'https://www.youtube.com/watch?v=rJlY1uKL87k',
		'https://www.youtube.com/watch?v=GdzrrWA8e7A',
		'https://www.youtube.com/watch?v=Y1nv35y886Y',
		'https://www.youtube.com/watch?v=c7rAknLeT-s',
		'https://www.youtube.com/watch?v=26l103sNnwM',
		'https://www.youtube.com/watch?v=7BgoXsZEuQ0',
		'https://www.youtube.com/watch?v=Lm6mrELlBtE',
		'https://www.youtube.com/watch?v=kyRZzzzjBxw', //https://www.youtube.com/watch?app=desktop&v=kyRZzzzjBxw&list=PLMeD3sfITven2bLRKPRhxga26VSeG5cAs&index=19&t=0s
		'https://youtu.be/2ed5QQ7exzw',
		'https://www.youtube.com/watch?v=5hqf5_3tLt0',
		'https://youtu.be/YtWrrI_A0e0',
		'https://youtu.be/RMCvF1sG2FA',
		'https://youtu.be/A-jjpax28uE',
		'https://youtu.be/30JZylPUmz0',
		'https://youtu.be/omZ4-wFlScE',
		'https://youtu.be/TO7z2FYB_mo',
		'https://youtu.be/CsQAaareXU8',
		'https://youtu.be/hHlXohfUFEI',
		'https://www.youtube.com/watch?v=ynVKsMS2ZZg',
		//'https://youtu.be/UkjFV-66E2c',
		'https://www.youtube.com/watch?v=CHfhIZf2SGg',
		'https://www.youtube.com/watch?v=MLLgrrPrdbQ',
		'https://www.youtube.com/watch?v=q_rxsPa_YCk',
		]
	};
	
	let playlist=library[playlistName];
	if(!playlist){
		playlist = await util.playlists.subredditArray(playlistName,'top');
	}
	if(!playlist){
		playlist = library['chill nintendo beats'];
	}
	let selection = _.sample(playlist);
	player.backgroundPlaylist=true;
	return player.play(message, selection, { firstResult: true });
}

var create = module.exports.create= function(message,client){
	//https://discord-player.js.org/global.html#PlayerOptions
	let options={
		leaveOnEnd:false,
		leaveOnEndCooldown:300,
		leaveOnStop:false,
		leaveOnEmpty:false,
		leaveOnEmptyCooldown:300,	
		autoSelfDeaf:true,
		quality:'high',
		enableLive: false,	    
	}
	var player = new Player(client,options);
	player.init=false;

	player.on("trackStart",function(message, track){
		if(track.skip){
			player.skip(message);
			//alert the user of what is now playing
			GUIMessages.nowPlaying(message,player,"Skipping ${track.name} for reason:${track.skip}");
		}

		
			init(message,player,function(){
				if(!player.backgroundPlaylist){
					player.emit('trackAdd',message,player.getQueue(message),player.nowPlaying(message));
				}
			})
		
			GUIMessages.nowPlaying(message,player)
		
		
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
		
	})
	// Send a message when something is added to the queue
	.on('trackAdd', async (message, queue, track) =>{
		if(!message || message.deleted){
			//GUIMessages.nowPlaying(message,player,`${user.username} likes ${track.title}`);
			return
		}
		if(message && !message.deleted){
			await message.delete();
		}

		var title = GUIMessages.presentTitle(track.title);
		var embed={
			"author": {
				"name": track.requestedBy.username,
				"url": `https://shiptunes.shipwa.sh/${track.requestedBy.id}`,
				"icon_url": track.requestedBy.avatarURL()||defaultAvatar
			},
			//"title":+`\n>>>${message.content}`
			"description":/*'> '+message.content.split('\n').join('\n> ')+`\n*/`Added: [${title}](${track.url})`,
			"thumbnail": {
				"url": `${track.thumbnail}`
			}
		}

		var reply = await message.channel.send({embed:embed}) //content:message.content

		//add custom properties 
		//to track
		await message.client.memory.channelSet(message, util.getYoutubeHash(track.url)+'_'+track.requestedBy.id+'_'+message, reply.id);

		//add custom properties permalinks to entries			
		//message.permalink=common.permalinkMessage(message.guild,message.channel,reply);
		reply.permalink=common.permalinkMessage(reply.guild,reply.channel,reply);

		await reply.react(reactions.upvote);
		await reply.react(reactions.downvote);

		const collector = reply.createReactionCollector((reaction, user) => {
			return [reactions.upvote, reactions.downvote].includes(reaction.emoji.name) 
		}); //{ time: 15000 }

		collector.on('collect', async(reaction, user) => {
			if(reaction.emoji.name === reactions.downvote){ //if downvote
				let originalPoster=(reply.embed || reply.embeds[0]).author
				if(!originalPoster){
					return //reaction.channel.send('not able to act upon this request')
				}
				let ogPosterID = (originalPoster.url || '').split('#').shift().split('/').pop();			
				if(user.id === ogPosterID){ //if original poster
					//delete message
					await reply.delete();

					//set it to be skipped
					track.skip=true;

					//if it is currently playing then skip
					var nowPlaying=player.nowPlaying(message)
					if(nowPlaying && nowPlaying===track){ //or message maybe?
						player.skip(message);
					}else{ //if it isn't playing then delete it
						player.remove(message,track);
					}

					//delete track from queue
// 							common.filterInPlace(track.queue.tracks,function(o) {
// 							   console.log('comparing',o.url,track.url)
// 							   return o.url !== track.url;
// 							});


					//alert everyone
					GUIMessages.nowPlaying(message,player,`${user.username} removed ${track.title}`);
				}else{ //these are just users that don't like the song and we will pass on their message
					GUIMessages.nowPlaying(message,player,`${user.username} does not like ${track.title}`);
				}
			}else if(reaction.emoji.name === reactions.upvote){ //these are users that like the song and we will pass on their message
				GUIMessages.nowPlaying(message,player,`${user.username} likes ${track.title}`);
			}
			console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
		});

// 				collector.on('end', collected => {
// 					console.log(`Collected ${collected.size} items`);
// 				});

		GUIMessages.nowPlaying(message,player,`${message.member.displayName} has added ${track.title}`);
	})
	.on('playlistAdd',function(message, queue, playlist){
		message.react(reactions.shipwash);
		//message.react('☑️');
		GUIMessages.nowPlaying(message,player,`${message.member.displayName} has added playlist ${playlist.title}`);
	})
	// Send messages to format search results
	.on('searchResults', (message, query, tracks) => {

	    const embed = new Discord.MessageEmbed()
	    .setAuthor(`Here are your search results for ${query}!`)
	    .setDescription(tracks.map((t, i) => `${i}. ${t.title}`))
	    .setFooter('Send the number of the song you want to play!')
	    message.channel.send(embed);

	})
	.on('searchInvalidResponse', (message, query, tracks, content, collector) => {

	    if (content === 'cancel') {
		collector.stop()
		return message.channel.send('Search cancelled!')
	    }

	    message.channel.send(`You must send a valid number between 1 and ${tracks.length}!`)

	})
	.on('searchCancel', (message, query, tracks) => message.channel.send('You did not provide a valid response... Please send the command again!'))
	.on('noResults', (message, query) => message.channel.send(`No results found on YouTube for ${query}!`))

	// Send a message when the music is stopped
	.on('queueEnd',async function(message, queue){ //'Music stopped. There no more music in the queue!'
		player.init=false
		playBackgroundPlaylist(message,player,'Playing background music until I get a new request')
	})
	.on('channelEmpty',function(message, queue){
		GUIMessages.nowPlaying(message,player,'I am alone in the voice channel. :frowning:');
		var channel=message.guild.me.voiceChannel.leave();
		if(channel){
			channel.leave();
		}
	})
	.on('botDisconnect',function(message){
		GUIMessages.nowPlaying(message,player,'Music stopped. I have been disconnected from the channel!');
	})

	// Error handling
	.on('error', (error, message) => {
	    switch(error){
// 		case 'NotPlaying':
// 		    console.error(error);
// 		    break;
		case 'NotConnected':
		    message.channel.send('You are not connected in any voice channel!')
		    break;
		case 'UnableToJoin':
		    message.channel.send('I am not able to join your voice channel, please check my permissions!')
		    break;
		case 'LiveVideo':
		    message.channel.send('YouTube lives are not supported!')
		    break;
		case 'VideoUnavailable':
		    message.channel.send('This YouTube video is not available!');
		    break;
		case 'Error: input stream: Status code: 429':
		    process.exit(1); 
		    message.channel.send(`Youtube ratelimit hit. Restarting...`)
		default:
	            console.error(error);
		    message.channel.send(`Something went wrong... ${error}`)
	    }
	})
	return player
}
var init = module.exports.init = function(message,player,callback){
		if(!player.init){
			var toID=setInterval(function(){
				var queue=player.getQueue(message);
				if(!queue){return}
				var voiceConnection= queue.voiceConnection;
				if(!voiceConnection){return}
				var dispatcher = voiceConnection.dispatcher;
				if(!dispatcher){return}
				player.setFilters(message, {
				 normalizer: true
				});
				player.setVolume(message, 56);
				console.log('set volume and filter properly');
				
				if(player.backgroundPlaylist){ //background list init
					var track = player.nowPlaying(message)
					if(track.durationMS>10*60*1000){ //if track is longer than 10 minutes then jump randomly to a location
						player.seek(message,_.random(0,track.duration));
					}
				}

				clearInterval(toID);
				if(callback){
					return (callback.call)?callback():GUIMessages.nowPlaying(message,player,callback)
				}
				GUIMessages.nowPlaying(message,player)
			})
			player.init=true;
			return
		}
		setTimeout(function(){
			if(callback){
				return (callback.call)?callback():GUIMessages.nowPlaying(message,player,callback)
			}
			GUIMessages.nowPlaying(message,player)
		},1);
}
