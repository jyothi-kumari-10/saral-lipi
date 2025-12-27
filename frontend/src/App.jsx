// src/App.jsx
import React, { useState, useRef } from 'react';
import { useTranslation} from 'react-i18next';
import axios from 'axios';
import './App.css';
import logo from './assets/logo.png';
import ReactMarkdown from "react-markdown";

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

function App() {
  const { t, i18n } = useTranslation();

  // UI states
  const [view, setView] = useState("upload");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);

  // Options
  const [processingMode, setProcessingMode] = useState("translate");
  const [outputLanguage, setOutputLanguage] = useState("hindi");

  // UI helpers
  const [activeResultTab, setActiveResultTab] = useState("simplified");

  const cameraInputRef = useRef(null);

  const fileInputRef = useRef(null);
  const triggerFileInput = () => fileInputRef.current.click();

  // UI language
  const handleUiLanguageChange = (e) => i18n.changeLanguage(e.target.value);

  // Mode change
  const handleModeChange = (e) => setProcessingMode(e.target.value);

  // Chat panel state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const [uploadErrorType, setUploadErrorType] = useState(null);


  // MULTI-FILE SELECTION

const handleFileChange = (event) => {
  const files = Array.from(event.target.files);
  setUploadErrorType("");

  // No file selected
  if (files.length === 0) {
    setUploadErrorType("noFile");
    return;
  }

  // File count validation
  if (files.length > MAX_FILES) {
    setUploadErrorType("tooManyFiles");
    event.target.value = "";
    return;
  }

  // File size validation
  for (const file of files) {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadErrorType("fileTooLarge");
      event.target.value = "";
      return;
    }
  }

  // All good
  if (files.length > 0) {
    setSelectedFiles(files);
    setView("options");
  }
};

  const handleChangeFile = () => {
    setSelectedFiles([]);
    setResults([]);
    setView("upload");
  };

  // COPY & DOWNLOAD
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text || "");
      alert("Copied to clipboard!");
    } catch {
      alert("Copy failed — try Ctrl+C manually.");
    }
  };

  const downloadTextFile = (filename, text) => {
    const blob = new Blob([text || ""], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  // PROCESS MULTIPLE FILES
  const handleProcessDocument = async () => {
    if (selectedFiles.length === 0) return alert("Please select files first.");

    setView("loading");
    const formData = new FormData();

    selectedFiles.forEach((file) => formData.append("documents", file));
    formData.append("mode", processingMode);
    if (processingMode === "translate") {
      formData.append("language", outputLanguage);
    }

    try {
      const resp = await axios.post("https://saral-lipi.onrender.com/api/process", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      });

      setResults(resp.data.results || []);
      setActiveFileIndex(0);
      if (processingMode === "translate") setActiveResultTab("translated");
      else setActiveResultTab("simplified");
      setView("results");
    } catch (err) {
      console.error("Processing error:", err);
      alert("Error processing files.");
      setView("options");
    }
  };

  // CHAT HANDLER
  const handleChatSend = async () => {
  if (!chatInput.trim()) return;

  const active = results[activeFileIndex];
  const context = active.simplifiedText || active.translatedText;

  // Add user message
  setChatMessages([...chatMessages, { role: "user", text: chatInput }]);

  const userMsg = chatInput;
  setChatInput("");
  setChatLoading(true);

  try {
    const resp = await axios.post("https://saral-lipi.onrender.com/api/ask", {
      question: userMsg,
      contextText: context,
    });

    const answer = resp.data.answer || "No answer available.";

    setChatMessages((prev) => [
      ...prev,
      { role: "assistant", text: answer }
    ]);
  } catch (e) {
    setChatMessages((prev) => [
      ...prev,
      { role: "assistant", text: "Error getting answer." }
    ]);
  } finally {
    setChatLoading(false);
  }
};


  // RENDER VIEWS
  const renderCurrentView = () => {
    // LOADING
    if (view === "loading") {
      return (
        <div className="loading-spinner">
          <p>{t("processingMessage")}</p>
        </div>
      );
    }
 
  
    // UPLOAD VIEW
    if (view === "upload") {
      return (
        <div className="upload-card" style={{ textAlign: "center" }}>
        <p className="app-description">{t("appDescription")}</p>

        <div className="button-group">
          <button className="btn btn-primary" onClick={triggerFileInput}>
            {t("uploadButton")}
          </button>
          <button className="btn btn-secondary" onClick={() => cameraInputRef.current.click()}>
            {t("cameraButton")}
          </button>
        </div>
        <div className="upload-hint">
          {t("uploadHint_part1")}{" "}
          <strong>{MAX_FILES}</strong>{" "}
          {t("uploadHint_part2")}{" "}
          <strong>{MAX_FILE_SIZE_MB} MB</strong>{" "}
          {t("uploadHint_part3")}{" "}
          <strong>{t("uploadHint_formats")}</strong>
        </div>

{uploadErrorType === "noFile" && (
  <div className="upload-error">
    {t("errorNoFile")}
  </div>
)}

{uploadErrorType === "tooManyFiles" && (
  <div className="upload-error">
    {t("errorTooManyFiles")}
  </div>
)}

{uploadErrorType === "fileTooLarge" && (
  <div className="upload-error">
    {t("errorFileTooLarge", { size: MAX_FILE_SIZE_MB })}
  </div>
)}


      </div>
      );
    }

    // OPTIONS VIEW
    if (view === "options") {
    return (
      <div className="upload-card" style={{ textAlign: "center" }}>
        <div className="file-info" style={{ textAlign: "left" }}>
          <strong>{t("fileUploaded")}</strong> {selectedFiles.length} files selected
        </div>

        <div className="form-group mode-selector">
          <label className="form-label">{t("processModeLabel")}</label>
          <div className="radio-group">
            <input
              type="radio"
              id="simplify-only"
              value="simplify"
              checked={processingMode === "simplify"}
              onChange={handleModeChange}
            />
            <label htmlFor="simplify-only" className="radio-label">
              {t("simplifyOnly")}
            </label>

            <input
              type="radio"
              id="translate"
              value="translate"
              checked={processingMode === "translate"}
              onChange={handleModeChange}
            />
            <label htmlFor="translate" className="radio-label">
              {t("simplifyAndTranslate")}
            </label>
          </div>
        </div>

        {processingMode === "translate" && (
          <div className="form-group">
            <label htmlFor="output-lang" className="form-label">{t("outputLangLabel")}</label>
            <select
              id="output-lang"
              value={outputLanguage}
              onChange={(e) => setOutputLanguage(e.target.value)}
            >
              <option value="hindi">Hindi</option>
              <option value="bhojpuri">Bhojpuri</option>
              <option value="kannada">Kannada</option>
              <option value="tamil">Tamil</option>
              <option value="telugu">Telugu</option>
            </select>
          </div>
        )}

        <div className="button-group">
          <button className="btn btn-primary" onClick={handleProcessDocument}>
            {t("processButton")}
          </button>
          <button className="btn btn-secondary" onClick={handleChangeFile}>
            {t("changeFile")}
          </button>
        </div>
      </div>
    );
  }

    // RESULTS VIEW
    if (view === "results") {
    const active = results[activeFileIndex];

    return (
      <div className={`content-wrapper ${chatOpen ? "shrink" : ""}`}>
        <div className="results-section">
        
        {/* Header */}
        {/* Unified Toolbar: Tabs + Actions */}
        <div className="results-toolbar">

          {/* Tabs – LEFT */}

            <div className="results-tabs">
              <button className={`tab ${activeResultTab === "raw" ? "active" : ""}`} onClick={() => setActiveResultTab("raw")}>
                {t("original")}
              </button>
              <button className={`tab ${activeResultTab === "simplified" ? "active" : ""}`} onClick={() => setActiveResultTab("simplified")}>
                {t("simplified")}
              </button>
              <button className={`tab ${activeResultTab === "translated" ? "active" : ""}`} onClick={() => setActiveResultTab("translated")}>
                {t("translated")}
              </button>
            </div>

          {/* Actions – RIGHT */}
          <div className="results-actions">
            <button className="btn btn-secondary" onClick={() => setView("options")}>
              {t("processAgain")}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                const content = `
Filename: ${active.filename}

--- RAW TEXT ---
${active.rawText || ""}

--- SIMPLIFIED TEXT ---
${active.simplifiedText || ""}

--- TRANSLATED TEXT ---
${active.translatedText || ""}
`;
                downloadTextFile(`${active.filename}.txt`, content);
              }}
            >
              {t("downloadAll")}
            </button>
          </div>
        </div>

        {/* Multi-file selector */}
        {results.length > 1 && (
          <div className="file-selector">
            {results.map((file, idx) => (
              <button
                key={idx}
                className={`tab ${idx === activeFileIndex ? "active" : ""}`}
                onClick={() => setActiveFileIndex(idx)}
              >
                {file.filename}
              </button>
            ))}
          </div>
        )}



        {/* Result content */}
        <div className="result-card">
          <h3>{active.filename}</h3>

          <div className="markdown-body result-pre">
            <ReactMarkdown>
              {activeResultTab === "raw"
                ? active.rawText
                : activeResultTab === "simplified"
                ? active.simplifiedText
                : active.translatedText}
            </ReactMarkdown>
          </div>


  

  {/* Copy + Download Buttons */}
  <div className="result-controls" style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
    
    <button
      className="btn btn-primary"
      onClick={() => {
        const text =
          activeResultTab === "raw"
            ? active.rawText
            : activeResultTab === "simplified"
            ? active.simplifiedText
            : active.translatedText;

        copyToClipboard(text);
      }}
    >
      {t("copy")}
    </button>

    <button
      className="btn btn-secondary"
      onClick={() => {
        const text =
          activeResultTab === "raw"
            ? active.rawText
            : activeResultTab === "simplified"
            ? active.simplifiedText
            : active.translatedText;

        const suffix =
          activeResultTab === "raw"
            ? "raw"
            : activeResultTab === "simplified"
            ? "simplified"
            : "translated";

        downloadTextFile(`${active.filename}-${suffix}.txt`, text);
      }}
    >
      {t("download")}
    </button>

    <button
      className="btn btn-primary"
      onClick={() => setChatOpen(true)}
    >
    {t("chat")}
    </button>

  </div>
</div>

</div>
      </div>
    );
  }
};

  return (
    <div className={`App view-${view}`}>
      <input
        type="file"
        name="documents"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/*,.pdf"
      />

      <input
        type="file"
        accept="image/*"
        ref={cameraInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        capture
      />

      <header className="app-header">
        <div className="logo-title">
          <img src={logo} alt="Saral Lipi Logo" className="app-logo" />
          <h1>{t("pageTitle")}</h1>
        </div>

        <div className="ui-lang-selector">
          <select onChange={handleUiLanguageChange} defaultValue="en">
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="kn">ಕನ್ನಡ</option>
            <option value="te">తెలుగు </option>
          </select>
        </div>
      </header>

      <main className="upload-container">
        {renderCurrentView()}
      </main>

      <div className={`chat-panel ${chatOpen ? "open" : ""}`}>
      <div className="chat-header">
        <h3>{t("chatTitle")}</h3>
        <button className="close-btn" onClick={() => setChatOpen(false)}>×</button>
      </div>

      <div className="chat-messages">
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`chat-msg ${msg.role}`}>
            {msg.text}
          </div>
        ))}

        {chatLoading && <div className="chat-msg assistant"> {t("thinking")}</div>}
      </div>

      <div className="chat-input-box">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder={t("chatPlaceholder")}
        />

        <button
          className="btn btn-primary"
          onClick={handleChatSend}
          disabled={chatLoading}
        >
          {t("send")}
        </button>
      </div>
     <footer className={`app-footer ${chatOpen ? "hidden" : ""}`}>
      <div className="footer-content">
        <p className="footer-title">{t("footerTitle")}</p>

        <p className="footer-tagline">
          {t("footerTagline")}
        </p>

        <p className="footer-disclaimer">
          {t("footerDisclaimer")}
        </p>
      </div>
    </footer>

    </div>

    </div>
  );
}

export default App;
