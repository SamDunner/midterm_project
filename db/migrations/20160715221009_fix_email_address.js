exports.up = function(knex, Promise) {
   return knex.schema.table('users', function(table){
    table.string('email');
    table.dropColumn('email address');
  });
};

exports.down = function(knex, Promise) {
 return knex.schema.table('users', function(table){
    table.dropColumn('email');
    table.string('email address');
  });
};
