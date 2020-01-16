import React from 'react';

import './styles.css';

const DevItem = ({ dev, onRemove }) => (
  <li className="dev-item">
    <header>
      <img src={dev.avatar_url} alt={dev.name} />
      <div className="user-info">
        <strong>{dev.name}</strong>
        <span>{dev.techs.join(', ')}</span>
      </div>
      <div
        className="remove-user"
        title="Remove usuário"
        role="presentation"
        onClick={() => onRemove(dev.github_username)}
      >
        X
      </div>
    </header>
    <p>{dev.bio}</p>
    <a href={`https://github.com/${dev.github_username}`}>Acessar perfil no GitHub</a>
  </li>
);

export default DevItem;
