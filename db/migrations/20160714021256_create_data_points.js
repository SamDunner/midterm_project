exports.up = function(knex, Promise) {
  return knex.schema.createTable('data_points', function (table) {
    table.increments('ID');
    table.string('name');
    table.string('type');
    table.float('latitude');
    table.float('longitude');
    table.integer('map_id');
    table.foreign('map_id').references('maps.ID');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('data_points');
};
