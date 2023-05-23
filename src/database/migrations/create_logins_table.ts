import { Knex } from 'knex';

export const up = (knex: Knex): Knex.SchemaBuilder => {
  return knex.schema.createTable('logins', (table) => {
    table.increments('id').primary();
    table.string('date').notNullable();
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('users.id');
    table.integer('entreprise_id').unsigned();
    table.foreign('entreprise_id').references('entreprises.id');
    table.timestamps(true, true);
  });
};

export const down = (knex: Knex): Knex.SchemaBuilder => {
  return knex.schema.dropTable('logins');
};