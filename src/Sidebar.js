

// Sidebar.js
import React from 'react';
import { MdDelete } from "react-icons/md";

const Sidebar = ({ deleteLastMessages, deleteMessage, chatHistory }) => {
  return (
    <div className="sidebar">
      <h3>Chat History</h3>
      <button onClick={deleteLastMessages}>
        <MdDelete /> Delete All
      </button>
      <div className="chat-history">
        {chatHistory.map((message, index) => (
          <div key={index} className={message.role}>
            <span>{message.content}</span>
            <span onClick={() => deleteMessage(index)}>
              <MdDelete />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
