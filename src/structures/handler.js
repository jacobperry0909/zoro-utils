const discordJS = require('discord.js');
const commandhandler = require('../handlers/command');
const eventHandler = require('../handlers/event');
const path_1 = require('path');
const utils = require('../utils/utils');

class handler {
     constructor(client, options = {}) {
        this.client = client;
        this.utils = utils;
        this.commandsDir = './commands'
        this.eventsDir = './events'
        this.prefix = '!'
        this.commands = new discordJS.Collection();
        this.events = new discordJS.Collection();
        this.owners = [];
        this.cooldowns = new discordJS.Collection();
        this.defaultCooldown = 3;

        if (!client) {
            throw new Error('Zoro utils >> No Discord.js Client instance passed in')
        }
        
        let { commands, events, token, commandTable } = options;

        if (!commands) {
            console.warn('Zoro utils >> No command directory specified')
        }

        if (!events) {
            console.warn('Zoro utils >> no events directory specified')
        }

        if (typeof commandTable === 'undefined') {
            commandTable = true;
        } else {
            if (typeof commandTable !== 'boolean') {
                throw new Error(`commandTable option must be a boolean value`)
            };
        }


        if (module && require.main) {
            const { path } = require.main;

            (async () => {
                await commandhandler(path_1.join(path, commands || this.commandsDir), this, commandTable);
                await eventHandler.eventhandler(path_1.join(path, events || this.eventsDir), this.client, this)
                await eventHandler.loaddefaults('../defaults/', this.client, this)
            })();
        }


    }

    setPrefix (prefix) {
        if (typeof prefix !== 'string') throw new Error('Prefix must be a string');
        this.prefix = prefix;
        return this
    }

    setOwners (owners) {
        let Owners;
        if (!owners) Owners = [];
        else Owners = owners; 
        this.owners = Owners;
        return this;
    }

    setDefaultCooldown (cooldown) {
        if (typeof cooldown !== 'number') throw new Error('default cooldown must be a number');
        this.defaultCooldown = cooldown;
        return this;
    }

}

module.exports = handler;