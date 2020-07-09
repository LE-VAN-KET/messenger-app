exports.up = (knex) => knex.schema.createTable('friends', (table) => {
    table.increments('id').primary();
    table.integer('userA').unsigned();
    table.foreign('userA').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.integer('userB').unsigned();
    table.foreign('userB').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.integer('relationship');
    table.text('message');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTableIfExists('friends');
