import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Image } from 'react-native';
import axios from 'axios';
import { launchCamera } from 'react-native-image-picker';

const App = () => {
  const [productos, setProductos] = useState<{ id: number, nombre: string, descripcion: string, precio: number, estado: string, categoria: string, fotografia_url: string }[]>([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [estado, setEstado] = useState('Disponible');
  const [categoria, setCategoria] = useState('');
  const [fotografia, setFotografia] = useState<string>(''); // Inicializamos como un string vacío

  // Obtener productos desde la API
  useEffect(() => {
    axios.get('http://localhost:3001/productos') // Asegúrate de que la URL es la correcta
      .then(response => setProductos(response.data))
      .catch(error => console.error('Error al obtener los productos:', error));
  }, []);

  // Agregar un producto
  const agregarProducto = () => {
    axios.post('http://localhost:3001/productos', {
      nombre,
      descripcion,
      precio,
      estado,
      categoria,
      fotografia_url: fotografia
    })
    .then(response => {
      setProductos([...productos, response.data]);
    })
    .catch(error => console.error('Error al agregar producto:', error));
  };

  // Eliminar un producto
  const eliminarProducto = (id: number) => {
    axios.delete(`http://localhost:3001/items/${id}`)
      .then(() => {
        setProductos(productos.filter(producto => producto.id !== id));
      })
      .catch(error => console.error('Error al eliminar producto:', error));
  };

  // Tomar una foto
  const tomarFoto = () => {
    launchCamera({
      mediaType: 'photo',  // Especificamos el tipo de media
    }, (response) => {
      if (response.didCancel || response.errorCode) {
        console.log('No se pudo tomar la foto');
      } else {
        if (response.assets && response.assets[0].uri) {
          setFotografia(response.assets[0].uri);  // Guardamos la URL de la foto
        }
      }
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Agregar Producto</Text>
      <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} />
      <TextInput placeholder="Precio" value={precio} onChangeText={setPrecio} keyboardType="numeric" />
      <TextInput placeholder="Categoría" value={categoria} onChangeText={setCategoria} />
      <Button title="Tomar Foto" onPress={tomarFoto} />
      {fotografia && <Image source={{ uri: fotografia }} style={{ width: 100, height: 100 }} />}
      <Button title="Agregar Producto" onPress={agregarProducto} />

      <FlatList
        data={productos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.nombre}</Text>
            <Text>{item.descripcion}</Text>
            <Text>{item.precio}</Text>
            <Text>{item.estado}</Text>
            <Text>{item.categoria}</Text>
            {item.fotografia_url && <Image source={{ uri: item.fotografia_url }} style={{ width: 100, height: 100 }} />}
            <Button title="Eliminar" onPress={() => eliminarProducto(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

export default App;
