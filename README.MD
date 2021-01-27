# zoro-utils
> npm install zoro-utils

## Handler

### Required options
- token

### optionals
- commands
- events
- commandTable

### defaults
- commands
    - './commands'
- events
    - './events'
- commandTable
    - true

### types
- commands
    - relative path
- events
    - relative path
- token
    - String
- commandTable
    - Boolean

### description
- commands
    - relative path to commands folder
- events
    - relative path to events folder
- token
    - bot token, can be found [here](https://discord.com/developers)
- commandTable
    - whether or not i should log loaded commands in a table. Recommened for use with a termial with emoji support

### handler methods
- setPrefix (prefix)
    - set the prefix for the bot
    - default: !

- setOwners (ownersArray)
    - set all bot owners
    - default: []

### examples

- index.js

        const zoroUtils = require('zoro-utils');
        const discordJS = require('discord.js');
        const client = new discordJS.Client();

        new zoroUtils.handler(client, {
        commands: './commands',
        events: './events',
        token: 'super_secret_token',
        commandTable: false
        })
        .setPrefix(';')
        .setOwners(['owner', 'ids'])

- commands/ping.js

        module.exports = {
            name: 'ping',
            aliases: ['p', 'pi'],
            reqArgs: 0,
            usage: 'none',
            nsfw: false,
            ownerOnly: false,
            execute({ message, args, handler, client }) {
                message.channel.send('pong');
            }
        }

- events/ready.js

        module.exports = (client, handler) => {
            console.log(`Logged in as ${client.user.tag}`)
        }

## utils

- comparePerms (member, target)
    - returns if the target has the highest ranking role, returns Boolean

- formatNumber (number)
    - returns number formatted properly with commas

### examples

- comparePerms

        const target = message.mentions.members.first();
        const member = message.member;
        console.log(handler.utils.comparePerms(member, target));

- formatNumber

        const num = 1000;
        console.log(handler.utils.formatNumber(num)) // 1,000