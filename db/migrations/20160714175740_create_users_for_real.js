
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.increments('ID');
    table.string('name');
    table.string('email address');
    table.string('password');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
