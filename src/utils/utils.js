
 function comparePerms (member, target) {
    return member.roles.highest.position < target.roles.highest.position;
 }

 function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

 module.exports = {
     comparePerms,
     formatNumber,
 }