import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faTelegram } from '@fortawesome/free-brands-svg-icons';

const tasks = [
  { id: 1, action: 'Follow us on Twitter', reward: 10, icon: faTwitter },
  { id: 2, action: 'Join Telegram Group', reward: 8, icon: faTelegram },
  { id: 3, action: 'Refer a Friend', reward: 20, icon: faUserFriends },
];

export default function Tasks() {
  return (
    <div className="px-4 pt-6 pb-20">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">📋 Tasks</h2>
      <div className="space-y-4">
        {tasks.map(task => (
          <div
            key={task.id}
            className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow flex items-center justify-between text-white"
          >
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={task.icon} className="text-yellow-300 text-lg" />
              <span>{task.action}</span>
            </div>
            <span className="text-yellow-300 font-bold">+{task.reward} </span>
          </div>
        ))}
      </div>
    </div>
  );
}
