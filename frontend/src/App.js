import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Detector from './components/Detector';
import Dashboard from './components/Dashboard';

function App() {
  const [activeTab, setActiveTab] = useState('detector');

  return (
    <Router>
      <div className="min-h-screen bg-dark-bg text-dark-text">
        {/* Header */}
        <header className="bg-dark-card border-b border-dark-border">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold">Fake News Detector</h1>
              </div>
              <div className="flex space-x-2">
                <Link
                  to="/"
                  onClick={() => setActiveTab('detector')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'detector'
                      ? 'bg-blue-600 text-white'
                      : 'bg-dark-bg text-dark-muted hover:text-dark-text'
                  }`}
                >
                  Detector
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-blue-600 text-white'
                      : 'bg-dark-bg text-dark-muted hover:text-dark-text'
                  }`}
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Detector />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-dark-card border-t border-dark-border mt-12">
          <div className="container mx-auto px-4 py-6 text-center text-dark-muted">
            <p>Powered by AI • BERT Model • FastAPI Backend</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
