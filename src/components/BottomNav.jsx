import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faBullseye,
  faCheckCircle,
  faUser
} from '@fortawesome/free-solid-svg-icons';

export default function BottomNav() {
  const navItems = [
    { to: '/', icon: faHome, label: 'Home' },
    { to: '/spin', icon: faBullseye, label: 'Spin' },
    { to: '/tasks', icon: faCheckCircle, label: 'Tasks' },
    { to: '/profile', icon: faUser, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm text-white border-t border-gray-800 flex justify-around py-2 z-50">
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${isActive ? 'text-yellow-400' : 'text-white'}`
          }
        >
          <FontAwesomeIcon icon={item.icon} size="lg" />
          <span className="mt-1">{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
}
