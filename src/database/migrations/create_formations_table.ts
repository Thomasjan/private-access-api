import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable('formations', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.string('category').notNullable();
    table.string('time').notNullable();
    table.timestamps(true, true);
  });

  await knex('formations').insert([
    {  title: 'Maquettage - cadrage du projet', category: 'Maquettage & intégration des données : 5 à 15 jours', time: '1 à 2 jours' },
    {  title: 'Base Article, Tiers & Contacts', category: 'Maquettage & intégration des données : 5 à 15 jours', time: '2 à 3 jours' },
    {  title: 'Base Tarifs', category: 'Maquettage & intégration des données : 5 à 15 jours', time: '1 à 2 jours' },
    
    {  title: 'Tiers, contacts et actions', category: 'Formation Gestion Commerciale PME: 3 à 6 jours', time: '0,5 jour' },
    {  title: 'Article (nomenclatures, valorisations ...)', category: 'Formation Gestion Commerciale PME: 3 à 6 jours', time: '2 jours' },
    
  ]);
};

export const down = (knex: Knex): Knex.SchemaBuilder => {
  return knex.schema.dropTable('formations');
};

