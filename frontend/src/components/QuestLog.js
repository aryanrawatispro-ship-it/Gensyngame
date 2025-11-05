import React from 'react';
import './QuestLog.css';

const QuestLog = ({ quests }) => {
  return (
    <div className="quest-log">
      <h3>Quest Log</h3>
      {quests.length === 0 ? (
        <div className="no-quests">No active quests</div>
      ) : (
        <ul>
          {quests.map(quest => (
            <li key={quest.id} className={quest.completed ? 'completed' : 'active'}>
              <div className="quest-title">
                {quest.completed ? '✓' : '○'} {quest.title}
              </div>
              <div className="quest-description">{quest.description}</div>
              <div className="quest-npc">NPC: {quest.npc}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuestLog;
