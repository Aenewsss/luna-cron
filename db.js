// lib/db.js
import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'sql10.freesqldatabase.com',
  user: 'sql10740019',
  password: 'LexASBaYZ3',
  database: 'sql10740019',
});