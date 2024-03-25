import mysql from 'mysql2';
require('dotenv').config();
import colors from 'colors';
import * as sql from 'mssql';


  //Connextion Mysql private_access
  const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });


  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log(colors.italic.magenta('Connected to MySQL database!'));
  });


  //Connextion SQL Server Gestimum
  const dbHost = process.env.DB_HOST_SQLSRV || 'localhost';
  const dbPort = process.env.DB_PORT_SQLSRV ? parseInt(process.env.DB_PORT_SQLSRV) : 1433;
  const dbConfig: sql.config = {
    server: dbHost,
    port: dbPort,
    user: process.env.DB_USERNAME_SQLSRV || '',
    password: process.env.DB_PASSWORD_SQLSRV || '',
    database: process.env.DB_DATABASE_SQLSRV || '',
    options: {
      encrypt: false, // Use this option if your SQL Server requires an encrypted connection
      trustServerCertificate: true,
    },
  };

const connectionGestimum = new sql.ConnectionPool(dbConfig);
console.log(colors.italic.magenta('Connected to SQL-SRV database!'));



const executeQuery = async (query: string): Promise<any> => {

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (error) {
    // throw new Error(`Error executing query: ${error}`);
    console.log(`Error executing query: ${error}`)
    return error;
  } 
}

export { connection, connectionGestimum, executeQuery };
