const Discord = require('discord.js');
const prettyMs = require('pretty-ms');

module.exports = (client, handler, message) => {
    const { prefix, owners, commands } = handler;

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.substring(prefix.length).split(/ /g);
    const commandName = args[0];
    args.shift();
    const command = commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.length && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.ownerOnly && !owners.includes(message.author.id)) return;

    if (command.guildOnly && !message.guild) return;

    if (command.reqArgs && command.reqArgs > args.length) {
        if (command.usage) {
            return message.channel.send(`Invalid usage: ${command.usage}`)
        } else {
            return message.channel.send(`Invalid usage`);
        }
    }

    if (command.nsfw && !message.guild.nsfw) return message.channel.send('this command only works in a nsfw channel');

    if (message.guild) {
        if (command.userPerms) {
            const missing = message.channel.permissionsFor(message.member).missing(command.userPerms);
			if (missing.length) {
				return message.reply(`You are missing ${missing.map(perm => `\`${perm.toLowerCase().replace('_', ' ')}\``).join(', ')} permissions, you need them to run this command.`);
			}
        }

        if (command.botPerms) {
            const missing = message.channel.permissionsFor(message.guild.me).missing(command.botPerms);
			if (missing.length) {
				return message.reply(`I am missing ${missing.map(perm => `\`${perm.toLowerCase().replace('_', ' ')}\``).join(', ')} permissions, I need them to run this command.`);
			}
        }
    }

    if (command.reqRole) {
        if (message.guild) {
            const role = message.guild.roles.cache.find(role => role.name === command.reqRole);

            if (!role) throw new Error(`${command.reqRole} dosnt exist in ${message.guild.name}`);
    
            if (!message.member.roles.cache.has(role.id)) return message.channel.send('You do not have permission to run this command');
        }
    }

    const cooldowns = handler.cooldowns;

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || handler.defaultCooldown) * 1000;
    
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            const exactTime = timeLeft.toFixed(0);
            return message.reply(`please wait ${prettyMs(parseInt(exactTime) * 1000,  {verbose: true})} before reusing the \`${command.name}\` command.`);
        }    
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        const params = {
            message,
            args,
            client,
            handler
        }
        command.execute(params);
    } catch (err) {
        console.log(err);
        message.channel.send(`An error occured when running the command: ${command.name}. If this continues happening consider contacting the bot developer`);
    }
}