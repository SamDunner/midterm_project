
exports.up = function(knex, Promise) {
  return knex.schema.table('data_points', function(table){
    table.integer('rating');
  });
};

exports.down = function(knex, Promise) {
   return table.dropColumn('rating');
};
