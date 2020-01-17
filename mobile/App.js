/* eslint react/jsx-filename-extension: 0 */
import React from 'react';
import { StatusBar } from 'react-native';

import Routes from './src/routes';

const App = () => (
  <>
    <StatusBar barStyle="light-content" backgroundColor="#7d40e7" />
    <Routes />
  </>
);

export default App;
