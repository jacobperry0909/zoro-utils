/**
 *
 * @param {Object} member
 * @param {Object} target
 * @type discordjs member object
 */

function comparePerms(member, target) {
	return member.roles.highest.position < target.roles.highest.position;
}

/**
 *
 * @param {Number} num
 */

function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

module.exports = {
	comparePerms,
	formatNumber,
};
