import { Knex } from 'knex';

export const up = (knex: Knex): Knex.SchemaBuilder => {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.integer('entreprise_id').unsigned();
    table.foreign('entreprise_id').references('entreprises.id');
    table.integer('role_id').unsigned();
    table.foreign('role_id').references('roles.id');
    table.timestamps(true, true);
  });
};

export const down = (knex: Knex): Knex.SchemaBuilder => {
  return knex.schema.dropTable('users');
};