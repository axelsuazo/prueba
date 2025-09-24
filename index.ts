import { AppRegistry } from 'react-native';
import App from './App';  // Importa el archivo App.tsx
import appConfig from './app.json';  // Importa el archivo completo app.json

const appName = appConfig.expo.name;  // Accede a 'name' dentro de 'expo'

AppRegistry.registerComponent(appName, () => App);
