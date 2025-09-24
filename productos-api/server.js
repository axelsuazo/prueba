const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors'); // Para permitir que tu frontend (si está en otro dominio) acceda a la API

const app = express();
const port = 3001;

// Habilitar CORS (Cross-Origin Resource Sharing) para permitir que se haga peticiones desde el frontend
app.use(cors());

// Configuración para que todas las respuestas tengan el Content-Type correcto
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8'); // Aseguramos que las respuestas tengan 'charset=utf-8'
  next();
});

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Cambia esto con tus credenciales
  password: '',  // Cambia esto con tus credenciales
  database: 'productos_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos');
});

app.use(bodyParser.json());

// Endpoint GET: obtener productos
app.get('/productos', (req, res) => {
  db.query('SELECT * FROM productos', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Endpoint POST: crear un producto
app.post('/productos', (req, res) => {
  const { nombre, descripcion, precio, estado, categoria, fotografia_url } = req.body;
  const query = 'INSERT INTO productos (nombre, descripcion, precio, estado, categoria, fotografia_url) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [nombre, descripcion, precio, estado, categoria, fotografia_url], (err, results) => {
    if (err) throw err;
    res.status(201).json({ id: results.insertId, nombre, descripcion, precio, estado, categoria, fotografia_url });
  });
});

// Endpoint DELETE: eliminar un producto por ID
app.delete('/items/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM productos WHERE id = ?', [id], (err, results) => {
    if (err) throw err;
    res.status(200).json({ message: 'Producto eliminado' });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`);
});
