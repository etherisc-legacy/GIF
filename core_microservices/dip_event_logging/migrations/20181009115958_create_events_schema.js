const { functions } = require('../knexfile');


exports.up = db => db.raw(functions.schema.up());
exports.down = db => db.raw(functions.schema.down());
