const GUIMessages = require.main.require('./templates/messages');
const { Command } = require('discord-akairo');
const { Player } = require("discord-player");
const emotes={error:":error:"}
const {reactions,defaultAvatar} = require.main.require('./common');
const common = require.main.require('./common');
const commandVars = common.commandVars(__filename);
const _ = require('lodash');
const web = require.main.require('./web');
const yaml = require('js-yaml');



module.exports.retrieveTrackMessage = function(message,track){
	var id = message.client.memory.channelGet(message, web.getYoutubeHash(track.url)+'_'+track.requestedBy.id+'_'+message); // || this.client.memory.channelSet(message, 'player', util.player.create(message,this.client));
	return message.channel.messages.fetch(id);
}



module.exports.encapsulate = function(message,override,dontDelete){
	if(!override){
		override=message.content;
	}

	let doc = override || {}
	var type = typeof doc;
	if(type == 'string'){
		let split = doc.split('\n');
		doc = {};
		if(split.length==1){
			doc.title = '\t '+split[0];
		}else{
		doc.title = split.shift();
		doc.description = split.join('\n')
		}
	}else if(Array.isArray(doc)){
		return message.channel.send('Can not process arrays');
	}
	let user = message.member || message.author
	let author = {
		name: user.displayName || user.tag,
		icon_url: message.author.avatarURL() || common.defaultAvatar,
		url: ` https://discordapp.com/users/${user.id}`,
	}
	doc.author=author;
	message.channel.send({embed:doc});
	if(!dontDelete){
		!message.deleted && message.delete();
	}
}

module.exports.permalink=function(message){
	return `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;
}

let permalinkRegex = /(discord.com)\/(channels)\/(\d+)\/(\d+)\/(\d+)/;
module.exports.parsePermalink=function(link){
	let match = (link||'').match(permalinkRegex);
	if(match[0] && match[1] && match[2] && match[3] && match[4] && match[5]){
		return {guild:match[3],
			channel:match[4],
			message:match[5],
			0:match[3],
			1:match[4],
			2:match[5]
		}
	}
}



module.exports.resolve=async function(message){
	//load partial
	if (message.partial) {
		try {
			return message.fetch();
		} catch (error) {
			console.error(`Something went wrong when fetching the message: ${message.id}`, error);
			return message;
		}
	}
	return message;
}
