const fs = require('fs');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const colors = require('colors');
const path = require('path');

const rows = [];

const commandhandler = (dir, handler, commandTable) => {
	if (!fs.existsSync(dir))
		throw new Error(`zoro utils >> couldn't find commands directory`);
	return glob(`${dir}/**/*.js`).then((commands) => {
		let totalCommands = 0;
		for (const commandFile in commands) {
			totalCommands++;
		}

		for (const commandFile of commands) {
			if (commandTable) {
				delete require.cache[commandFile];
				const File = require(commandFile);
				const name = File.name;

				const status = new Status(File, check(File));
				rows.push(status);

				if (check(File) === '✅') {
					try {
						if (File.init) {
							File.init(handler.client, handler);
						}
					} catch (err) {
						console.log(
							colors.red(
								`Failed to run init function in command "${name}".\nError:\n${err}`
							)
						);
					}
					handler.commands.set(name, File);
				}

				if (rows.length === totalCommands) {
					console.table(rows);
				}
			} else {
				delete require.cache[commandFile];
				const File = require(commandFile);

				if (check(File) === '✅') {
					handler.commands.set(File.name, File);
					console.log(
						colors.green(`Command handler >> Loaded "${File.name}"`)
					);
				} else {
					const { name } = path.parse(commandFile);
					console.log(
						colors.red(
							`Command handler >> Failed to load "${name}"`
						)
					);
				}
			}
		}
	});
};

function check(file) {
	let check;
	if (!file.name || !file.execute) check = '❌';
	else check = '✅';

	return check;
}

function Status(file, check) {
	this.name = file.name || 'not included';
	this.status = check;
}

module.exports = commandhandler;
