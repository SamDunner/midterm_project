
exports.up = function(knex, Promise) {
  return knex.schema.table('maps', function(table){
    table.integer('user_id');
    table.foreign('user_id').references('users.ID');
  });
};

exports.down = function(knex, Promise) {
  return table.dropColumn('user_id');
};
