CREATE DATABASE productos_db;

USE productos_db;

CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255),
  descripcion TEXT,
  precio FLOAT,
  estado ENUM('Disponible', 'No disponible'),
  categoria VARCHAR(255),
  fotografia_url VARCHAR(255)
);
