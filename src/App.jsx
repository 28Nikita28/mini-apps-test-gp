import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconButton, useTheme, ThemeProvider, createTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import Background from './components/Background';
import './App.css';

const messageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -100 },
};

function App() {
  const [activeModel, setActiveModel] = useState('gpt-4');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const chatLogRef = useRef(null);

  const theme = createTheme({
    palette: { mode: darkMode ? 'dark' : 'light' },
  });

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { content: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: input }),
      });

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();
      const aiMessage = { content: data.content, isUser: false };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = { content: `Ошибка: ${error.message}`, isUser: false };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ThemeProvider theme={theme}>
      <Background />
      <div className={`app ${darkMode ? 'dark-theme' : 'light-theme'}`}>
        {/* Sidebar */}
        <div className="sidebar">
          <div className="title-container">
            <motion.h1
              className="gradient-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ fontSize: '2.2rem' }}
            >
              Web3 AI
            </motion.h1>
          </div>
          <div className="model-switcher">
            {['gpt-4', 'claude'].map((model) => (
              <motion.button
                key={model}
                className={`model-button ${activeModel === model ? 'active' : ''}`}
                onClick={() => setActiveModel(model)}
                whileHover={{ scale: 1.05 }}
              >
                {model === 'gpt-4' ? 'GPT-4 Pro' : 'Claude Expert'}
              </motion.button>
            ))}
          </div>
          <IconButton
            onClick={() => setDarkMode(!darkMode)}
            color="inherit"
            sx={{ position: 'absolute', bottom: '2rem', left: '2rem' }}
          >
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </div>

        {/* Main Content */}
        <div className="main-content">
  {/* Chat Log */}
  <div className="chat-log" ref={chatLogRef}>
    <AnimatePresence>
      {messages.map((msg, index) => (
        <motion.div
          key={index}
          variants={messageVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <div
            className={`message ${msg.isUser ? 'user' : 'ai'}`}
            dangerouslySetInnerHTML={{ __html: msg.content }}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  </div>

          {/* Input Section */}
          <motion.div
            className="input-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      placeholder="Type your message..."
    />
            <motion.button
              onClick={sendMessage}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send
            </motion.button>
          </motion.div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
