exports.up = function(knex, Promise) {
  return knex.schema.createTable('maps', function (table) {
    table.increments('ID');
    table.string('name');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('maps');
};


