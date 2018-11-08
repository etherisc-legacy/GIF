const { functions } = require('../knexfile');


exports.up = db => db.raw(functions.update_updated.up());

exports.down = db => db.raw(functions.update_updated.down());
