const { promisify } = require('util');
const glob = promisify(require('glob'));
const path = require('path');
const fs = require('fs');

const load = (dir, client, handler) => {
	if (!fs.existsSync(dir));
	return glob(`${dir}/**/*.js`).then((features) => {
		for (const featureFile of features) {
			const { name } = path.parse(featureFile);

			const file = require(featureFile);
			file(client, handler);

			console.log(`Feature handler >> Loaded "${name}"`);
		}
	});
};

module.exports = load;
