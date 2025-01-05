import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Copy, Check } from 'lucide-react';
import './App.css';
import FullscreenImage from './FullscreenImage';

function App() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [password, setPassword] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showInitialModal, setShowInitialModal] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [showFullscreenImage, setShowFullscreenImage] = useState(true);
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        if (!isLoading) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 2000);
            return () => clearInterval(interval);
        }
    }, [isLoading]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get('https://chat-ttud.vercel.app/api/messages');
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleCopy = async (text, id) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (error) {
            console.error('Failed to copy text:', error);
        }
    };

    const handleInitialChoice = async (shouldDelete) => {
        if (shouldDelete) {
            try {
                await axios.delete('https://chat-ttud.vercel.app/api/messages', {
                    data: { password }
                });
                setPassword('');
                setShowInitialModal(false);
                setIsLoading(false);
            } catch (error) {
                if (error.response?.status === 401) {
                    alert('Invalid password');
                    return;
                }
                console.error('Error clearing messages:', error);
            }
        } else {
            setShowInitialModal(false);
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await axios.post('https://chat-ttud.vercel.app/api/messages', {
                content: newMessage
            });
            setNewMessage('');
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleDeleteMessage = async (id) => {
        try {
            await axios.delete(`https://chat-ttud.vercel.app/api/messages/${id}`);
            fetchMessages();
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const handleClearAll = async () => {
        try {
            await axios.delete('https://chat-ttud.vercel.app/api/messages', {
                data: { password }
            });
            setPassword('');
            setShowDeleteModal(false);
            fetchMessages();
        } catch (error) {
            if (error.response?.status === 401) {
                alert('Invalid password');
            } else {
                console.error('Error clearing messages:', error);
            }
        }
    };

    return (
      <>
          {showFullscreenImage && (
              <FullscreenImage onClose={() => setShowFullscreenImage(false)} />
          )}
          {!showFullscreenImage && (
              <div className="App">
                  {isLoading ? (
                      showInitialModal && (
                          <div className="modal-overlay">
                              <div className="modal">
                                  <h2>Welcome to Self Message App</h2>
                                  <p>Would you like to delete all previous messages?</p>
                                  {password !== '' && (
                                      <input
                                          type="password"
                                          value={password}
                                          onChange={(e) => setPassword(e.target.value)}
                                          placeholder="Enter password to delete"
                                      />
                                  )}
                                  <div className="modal-buttons">
                                      {password === '' ? (
                                          <>
                                              <button onClick={() => setPassword('1')}>Yes, delete all</button>
                                              <button onClick={() => handleInitialChoice(false)}>No, keep messages</button>
                                          </>
                                      ) : (
                                          <>
                                              <button onClick={() => handleInitialChoice(true)}>Confirm Delete</button>
                                              <button onClick={() => handleInitialChoice(false)}>Cancel</button>
                                          </>
                                      )}
                                  </div>
                              </div>
                          </div>
                      )
                  ) : (
                      <>
                          <header>
                              <h1>Self Message App</h1>
                              <button 
                                  className="clear-all-btn"
                                  onClick={() => setShowDeleteModal(true)}
                              >
                                  Clear All Messages
                              </button>
                          </header>
                          
                          <div className="message-container">
                              {messages.map((message) => (
                                  <div key={message._id} className="message">
                                      <div className="message-content">
                                          <pre className="message-text">{message.content}</pre>
                                          <small>{new Date(message.timestamp).toLocaleString()}</small>
                                      </div>
                                      <div className="message-actions">
                                          <button
                                              className="action-btn"
                                              onClick={() => handleCopy(message.content, message._id)}
                                              title="Copy message"
                                          >
                                              {copiedId === message._id ? (
                                                  <Check className="w-4 h-4" />
                                              ) : (
                                                  <Copy className="w-4 h-4" />
                                              )}
                                          </button>
                                          <button 
                                              className="delete-btn"
                                              onClick={() => handleDeleteMessage(message._id)}
                                          >
                                              ×
                                          </button>
                                      </div>
                                  </div>
                              ))}
                          </div>
  
                          <form onSubmit={handleSubmit} className="message-form">
                              <textarea
                                  value={newMessage}
                                  onChange={(e) => setNewMessage(e.target.value)}
                                  placeholder="Type your message..."
                                  rows={3}
                              />
                              <button type="submit">Send</button>
                          </form>
  
                          {showDeleteModal && (
                              <div className="modal-overlay">
                                  <div className="modal">
                                      <h2>Clear All Messages</h2>
                                      <p>Enter password to confirm:</p>
                                      <input
                                          type="password"
                                          value={password}
                                          onChange={(e) => setPassword(e.target.value)}
                                          placeholder="Enter password"
                                      />
                                      <div className="modal-buttons">
                                          <button onClick={handleClearAll}>Confirm</button>
                                          <button onClick={() => {
                                              setShowDeleteModal(false);
                                              setPassword('');
                                          }}>Cancel</button>
                                      </div>
                                  </div>
                              </div>
                          )}
                      </>
                  )}
              </div>
          )}
      </>
  );
}

export default App;