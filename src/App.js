import './App.css';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import History from './components/History';
function App() {
  const [history, setHistory] = useState([]);
  const [aiModel, setAiModel] = useState("groq");
  
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
    const fetchData = async () => {
      if (prompt.trim().length >= 3) {
        try {
          // Show loader and hide actions
          document.getElementById("output").innerHTML = `<div class="text-center"><div class="spinner-grow text-light" role="status"><span class="sr-only">Loading...</span></div></div>`;
          document.getElementById("actions").style.display = "none";
          const response = await axios.post(
            `https://open-ai-backend-opal.vercel.app/${aiModel}`,
            {
              prompt
            }
          );
          // Update output with response data and show actions
          document.getElementById("output").innerText = response.data.toString();
          document.body.scrollTop = 0; // For Safari
          document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
          historyData(prompt, response.data);
          if (response.data.trim() === '') {
            document.getElementById("output").innerHTML = "Sorry Not Able to Understand";
          }
          document.getElementById("actions").style.display = "flex";
        } catch (error) {
          document.getElementById("output").innerHTML = "Sorry Not Able to Understand";
        }
      }
    };
    fetchData();
  }
  const downloadFile = () => {
    const link = document.createElement("a");
    const content = document.getElementById("output").innerHTML;
    const file = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = document.getElementById("prompt").value + ".txt";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function copy() {
    let output = document.getElementById("output").innerHTML;
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
        <label htmlFor="prompt" className='mt-5 d-flex' >
          <h1>
            <select name="aimodel" title="Use both ChatGPT and Gemini" id="aimodel" onChange={(e) => setAiModel(e.target.value)}>
              <option value="groq">TJ GROQ</option>
              <option value="gemini">TJ GEMINI</option>
              <option value="gpt">TJ GPT</option>
            </select></h1>
        </label>
        <div id="actions" style={{ display: 'none' }}>
          <button className="fa fa-download download" id="download" title="Download" onClick={() => { downloadFile() }}></button>
          <button className="fa fa-copy copy" buttonid="copy" title="Copy" onClick={() => { copy() }}></button>
        </div>
        <label htmlFor="prompt" id="output" className='pre-wrapper p-lg-5 p-3' style={{ fontSize: '1.2rem', minHeight: '300px' }}>
          <h2>How can I help you today?</h2>
        </label>
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
