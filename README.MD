# zoro-utils

> npm install zoro-utils

## handler

### example

main file

```js
const zoroUtils = require('zoro-utils');
const discordJS = require('discord.js');
const client = new discordJS.Client();

new zoroUtils.handler(client, {
	commands: './commands',
	events: './events',
	commandTable: false,
})
	.setPrefix(';')
	.setOwners([]);

client.login('super_secret_token');
```

takes 2 paramaters. A instance of a discord.js Client, and options

### options

commands - relative path to commands folder - String

events - relative path to events folder - String

commandTable - whether or not you want a table to print with commands - Boolean

### methods

setPrefix(prefixString)

sets the bot prefix

default: !

setOwners(ownerArray)

sets the bots owners

default: []

setDefaultCooldown(cooldownNumber)

set the default command cooldown aka rate limit

cooldown is in seconds

default: 3

## commands

all commands should export an object

the object must have a name property, and an execute function to load

paramaters use object destructuring, available paramaters incude:

message - message object

args - args array

handler - handler instance

client - client instance

### folder structure

commands can be in as many subfolders as you would like, or not in a subfolder at all

for example

commands/general/dir/dir2/dir3/ping.js would still work

and so would commands/ping.js

### properties

name - name of command - String

aliases - array of names the command can be run from - Array

reqArgs - args array length requried - Number

usage - command usage - String

nsfw - if command should only work in nsfw channels - Boolean

ownerOnly - if command should only let owners use command - Boolean

botPerms - list of required permissions for the bot to run the command - Array

userPerms - list of required permissions for the user to run the command - Array

reqRole - certain role needed for a user to run a command. must be a role name - String

you can add some if you would like, for a help command you may want a description as well.

### example

commands/pings.js

```js
module.exports = {
	name: 'ping',
	aliases: ['p'],
	cooldown: 10, // seconds
	reqArgs: 0,
	usage: 'example',
	nsfw: false,
	ownerOnly: false,
	userPerms: ['ADMINISTRATOR', 'more', 'more'],
	botPerms: ['ADMINISTRATOR'],
	reqRole: 'role name',
	init(client, handler) {
		console.log('This function runs when the command loads');
		/*
		This is useful for things like caching
		or just more logging.
		This is optional
		*/
	},
	execute({ message, args, handler, client }) {
		message.channel.send('pong');
	},
};
```

## events

all events export a function.

name of file is the name of the event

all default events can be over rided by making an event with the same name as the default event

paramaters include (client, handler, whatever, params, required, for, event)

### folder structure

events can be in as many subfolders as you would like, or not in a subfolder at all

for example

events/message/dir/dir2/dir3/message.js would still work

and so would events/message.js

### example

events/ready.js

```js
module.exports = (client, handler) => {
	console.log(`Logged in as ${client.user.tag}`);
};
```

events/message.js

```js
module.exports = (client, handler, message) => {
	console.log('I seen that');
};
```

## Features

features can be in as many subfolders as you would like. Or not in any.

for example

features/dir/dir2/dir3/message.js would work
and so would features/message.js

features should export a function with 2 paramaters.
paramaters are client and handler

for example

features/test.js

```js
module.exports = (client, handler) => {
	client.on('message', (message) => {
		console.log(message.content);
	});

	client.on('ready', () => {
		console.log('ready');
	});
};
```

You can have as many features as you would like in the same file, or in different files.

## utils

to use utils inside of commands use handler.utils.function

for example

```js
module.exports = {
	name: 'formatNumber',
	execute({ message, args, handler }) {
		const num = parseInt(args[0]);
		const formattedNum = handler.utils.formatNumber(num);

		message.channel.send(formattedNum);
	},
};
```

formatNumber(Number)
if a number is not passed in returns NaN
if number is passed in, returns number with commas in correct place

---

comparePerms(member, target)

member and target, both need to be 2 differnt member objects

returns if the target has higher roles in the hierarchy or not
