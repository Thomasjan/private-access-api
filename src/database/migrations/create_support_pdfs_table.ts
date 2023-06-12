import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable('support_pdfs', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.string('category').notNullable();
    table.string('link').notNullable();
    table.timestamps(true, true);
  });

  await knex('roles').insert([
    { title: 'Préconisations techniques et installation Gestimum ERP', category: 'Général', link: 'http://docs.gestimum.com/ERP/8/Installation/#t=Pages%2FPreambule.htm' },
    { title: 'Installation Gestimum ERP - Mise à jour de version', category: 'Général', link: 'http://docs.gestimum.com/ERP/8/Installation/#t=Pages%2FPreambule.htm' },
    { title: "Création d'un champ personnalisé", category: "l'intégré", link: 'http://docs.gestimum.com/ERP/8/Installation/#t=Pages%2FPreambule.htm' },
    { title: "Création d'un champ person 	Création Champs personnalisés avec formulesnalisé", category: "l'intégré", link: 'http://docs.gestimum.com/ERP/8/Installation/#t=Pages%2FPreambule.htm' },
    
  ]);
};

export const down = (knex: Knex): Knex.SchemaBuilder => {
  return knex.schema.dropTable('support_pdfs');
};

