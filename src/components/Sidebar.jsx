import React from 'react';
import PropTypes from 'prop-types';
import './Sidebar.css';

const Sidebar = ({ activeView, setActiveView }) => {
  const menuItems = [
    { label: '🌞 My Day', key: 'today' },
    { label: '📅 Planned', key: 'planned' },
    { label: '📋 All Tasks', key: 'all' },
    { label: '⭐ Important', key: 'important' },
  ];

  return (
    <div className="sidebar">
      <div className="profile">
        <img src="https://i.pravatar.cc/60" alt="profile" />
        <h3>Hello, Tejal</h3>
      </div>

      <ul className="nav-menu">
        {menuItems.map((item) => (
          <li key={item.key}>
            <button
              className={`nav-button ${activeView === item.key ? 'active' : ''}`}
              onClick={() => setActiveView(item.key)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

Sidebar.propTypes = {
  activeView: PropTypes.string.isRequired,
  setActiveView: PropTypes.func.isRequired,
};

export default Sidebar;
