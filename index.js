/**
 * @format
 */

import 'react-native-url-polyfill/auto';
import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Suppress non-fatal warning banners (yellow box alerts) on the device screen
LogBox.ignoreAllLogs();

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('main', () => App);


