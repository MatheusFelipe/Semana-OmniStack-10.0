import React, { useState, useEffect } from 'react';

import api from './services/api';
import DevItem from './components/DevItem';
import DevForm from './components/DevForm';

import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

const App = () => {
  const [devs, setDevs] = useState([]);

  useEffect(() => {
    api.get('/devs').then(resp => setDevs(resp.data.devs));
  }, []);

  const onSubmit = data =>
    api.post('/devs', data).then(({ data: { dev } }) => {
      const oldDev = devs.find(d => d.github_username === dev.github_username);
      if (!oldDev) setDevs([...devs, dev]);
    });

  const onRemove = githubUsername =>
    api.delete(`/devs/${githubUsername}`).then(() => {
      setDevs(devs.filter(dev => dev.github_username !== githubUsername));
    });

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={onSubmit} />
      </aside>
      <main>
        <ul>
          {devs.map(dev => (
            <DevItem key={dev.github_username} dev={dev} onRemove={onRemove} />
          ))}
        </ul>
      </main>
    </div>
  );
};

export default App;
