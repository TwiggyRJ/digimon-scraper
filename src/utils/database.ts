import mysql from 'mysql2';

export default function getConnection() {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'digimon',
  });

  connection.connect((error) => {
    if (error) throw error;
    console.log('Connected!');
  });

  return connection;
}
