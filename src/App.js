import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import History from './components/History';
import { motion } from 'framer-motion';

function App() {
  const [history, setHistory] = useState([]);
  const [aiModel, setAiModel] = useState("groq");
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showPromptText, setShowPromptText] = useState(true); // For showing prompt message

  function historyData(prompt, result) {
    const history = JSON.parse(localStorage.getItem("history"));
    const date = new Date();
    const timestamp = date.toLocaleTimeString() + ' ' + date.toLocaleDateString();
    history.push({ prompt, result, timestamp });
    localStorage.setItem("history", JSON.stringify(history));
    setHistory(history.reverse());
  }

  async function prompt(e) {
    e.preventDefault();
    let prompt = document.getElementById("prompt").value.trim();
    if (prompt.length >= 3) {
      setLoading(true);
      setError(false);
      setShowPromptText(false); // Hide the initial message
      setOutput('');
      document.getElementById("actions").style.display = "none";
      try {
        const response = await axios.post(
          `https://open-ai-backend-opal.vercel.app/${aiModel}`,
          { prompt }
        );
        setOutput(response.data.toString().replaceAll("*",""));
        historyData(prompt, response.data);
        if (response.data.trim() === '') {
          setOutput("Sorry Not Able to Understand");
        }
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
      } catch (error) {
        setError(true); // Show retry animation
        setOutput("Sorry Not Able to Understand");
      } finally {
        setLoading(false);
        document.getElementById("actions").style.display = "flex";
      }
    }
  }

  const downloadFile = () => {
    const link = document.createElement("a");
    const content = output;
    const file = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = document.getElementById("prompt").value + ".txt";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function copy() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(output);
    }
  }

  useEffect(() => {
    if (!localStorage.getItem("history")) {
      localStorage.setItem("history", "[]");
    }
  }, []);

  useEffect(() => {
    document.title = `Tirthesh Jain ${aiModel.toUpperCase()}`;
  }, [aiModel]);

  return (
    <div className="App">
      <div className="App-header">
        <label htmlFor="prompt" className='mt-5 d-flex'>
          <h1>
            <select name="aimodel" title="Use both ChatGPT and Gemini" id="aimodel" onChange={(e) => setAiModel(e.target.value)}>
              <option value="groq">TJ GROQ</option>
              <option value="gemini">TJ GEMINI</option>
              <option value="gpt">TJ GPT</option>
            </select>
          </h1>
        </label>
        <div id="actions" style={{ display: 'none' }}>
          <button className="fa fa-download download" id="download" title="Download" onClick={downloadFile}></button>
          <button className="fa fa-copy copy" id="copy" title="Copy" onClick={copy}></button>
        </div>
        <motion.div
          id="output"
          className='pre-wrapper p-lg-5 p-3'
          style={{ fontSize: '1.2rem', minHeight: '300px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {!loading && !error && output && (
            <motion.div
              key={output}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-output"
            >
              {output.replaceAll("*","").split('').map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.01 }} // Slight delay per character
                  
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
          )}

          {showPromptText && !loading && (
            <h2>How can I help you today?</h2>
          )}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <div className="loading-animation">Loading...</div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <div className="error-animation">Oops! Something went wrong, try again.</div>
            </motion.div>
          )}
        </motion.div>
        <form onSubmit={prompt} id="searchprompt" className="search">
          <div id="flex">
            <input type="text" name="prompt" id="prompt" placeholder="How Can I Help You Today?" minLength={3} required autoFocus />
            <button className="fa fa-send-o"></button>
          </div>
        </form>
      </div>
      <History history={history} setHistory={setHistory} />
    </div>
  );
}

export default App;
