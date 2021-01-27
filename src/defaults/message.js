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

    if (command.botPerms) {
        const missing = [];
        for (const perm in command.botPerms) {
            if (!message.guild.me.hasPermission(perm)) {
                missing.push(perm);
            }
        }

        if (missing.length) {
            return message.channel.send(`I am missing the required permissions ${missing.map(perm => `\`${perm}\``).join(', ')}, to run this command`);
        }
    }

    if (command.userPerms) {
        const missing = [];
        for (const perm in command.botPerms) {
            if (!message.member.hasPermission(perm)) {
                missing.push(perm);
            }
        }

        if (missing.length) {
            return message.channel.send(`You are missing the required permissions ${missing.map(perm => `\`${perm}\``).join(', ')}, to run this command`);
        }
    }

    try {
        const perms = {
            message,
            args,
            client,
            handler
        }
        command.execute(perms);
    } catch (err) {
        console.log(err);
        message.channel.send(`An error occured when running the command: ${commandName}. If this continues happening consider contacting the bot developer`);
    }
}