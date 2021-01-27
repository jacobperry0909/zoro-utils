const fs = require('fs');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const path = require('path');

const eventHandler = (dir, client, handler) => {
    if (!fs.existsSync(dir)) return;
    return glob(`${dir}**/*.js`).then(events => {
        for (const eventFile of events) {
            delete require.cache[eventFile];
            const { name } = path.parse(eventFile);
            const File = require(eventFile);

            checkEvent(name);

            handler.events.set(name, null);

            client.on(name, File.bind(null, client, handler));
            console.log(`Event handler >> loaded "${name}"`);
        }
    })
}

const loadDefaults = (dir, client, handler) => {
    fs.readdirSync(path.join(__dirname, '../defaults/')).forEach(event => {
        const name = event.split(".")[0];
        const file = require(`../defaults/${event}`);

        if (handler.events.has(name)) return;

        handler.events.set(name, null)
        client.on(name, file.bind(null, client, handler));
        console.log(`Event handler >> default event loaded "${name}"`);
    })
}

function checkEvent(eventName) {
    const validEvents = [
        "channelCreate",
        "channelDelete",
        "channelPinsUpdate",
        "channelUpdate",
        "debug",
        "emojiCreate",
        "emojiDelete",
        "emojiUpdate",
        "error",
        "guildBanAdd",
        "guildBanRemove",
        "guildCreate",
        "guildDelete",
        "guildIntegrationsUpdate",
        "guildMemberAdd",
        "guildMemberAvailable",
        "guildMemberRemove",
        "guildMembersChunk",
        "guildMemberSpeaking",
        "guildMemberUpdate",
        "guildUnavailable",
        "guildUpdate",
        "invalidated",
        "inviteCreate",
        "inviteDelete",
        "message",
        "messageDelete",
        "messageDeleteBulk",
        "messageReactionAdd",
        "messageReactionRemove",
        "messageReactionRemoveAll",
        "messageReactionRemoveEmoji",
        "messageUpdate",
        "presenceUpdate",
        "rateLimit",
        "ready",
        "roleCreate",
        "roleDelete",
        "roleUpdate",
        "shardDisconnect",
        "shardError",
        "shardReady",
        "shardReconnecting",
        "shardResume",
        "typingStart",
        "userUpdate",
        "voiceStateUpdate",
        "warn",
        "webhookUpdate",
    ];
    if (!validEvents.includes(eventName))
        throw new Error(`
        Event handler >> Unknown Event "${eventName}" `);
    return true;
}

module.exports.eventhandler = eventHandler;
module.exports.loaddefaults = loadDefaults;