import mysql from 'mysql2';
require('dotenv').config();
import colors from 'colors';
import * as sql from 'mssql';


  //Connextion Mysql private_access
  const config = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  };

  var connection;

  const handleDisconnect = () => {
    connection = mysql.createConnection(config); // Recreate the connection, since
    // the old one cannot be reused.

    connection.connect(function(err) {              
    if(err) {                                     
    console.log('error when connecting to db:', err);
    setTimeout(handleDisconnect, 2000); 
    }                                     
    });  

    connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
    handleDisconnect();                         
    } else {                                       
    throw err;                
    }
    });
  };

  handleDisconnect();


  // const DBconnection = async () => {
  //   connection.connect((err) => {
  //     if (err) {
  //       console.error('Error connecting to the database:', err);
  //       return;
  //     }
  //     console.log(colors.italic.magenta('Connected to MySQL database!'));
  //   });
  // }

  // const DBdisconnect = () => {
  //   connection.end();
  //   console.log(colors.italic.magenta('Disconnected from MySQL database!'));
  // }

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

export { connection, connectionGestimum, executeQuery};
