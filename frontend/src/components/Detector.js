import React, { useState } from 'react';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import ResultCard from './ResultCard';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function Detector() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_URL}/predict`, {
        text: text
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">AI-Powered News Verification</h2>
        <p className="text-dark-muted">
          Paste any news article below to check its authenticity using advanced AI analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
          <h3 className="text-xl font-semibold mb-4">Input Article</h3>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your news article here..."
            className="w-full h-64 bg-dark-bg border border-dark-border rounded-lg p-4 text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            disabled={loading}
          />
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span>Analyze Article</span>
                </>
              )}
            </button>
            <button
              onClick={handleClear}
              disabled={loading}
              className="bg-dark-bg hover:bg-dark-border disabled:opacity-50 text-dark-text font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>
          {error && (
            <div className="mt-4 bg-red-900/20 border border-red-500 text-red-400 rounded-lg p-4">
              {error}
            </div>
          )}
        </div>

        {/* Result Section */}
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
          <h3 className="text-xl font-semibold mb-4">Analysis Result</h3>
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <LoadingSpinner size="large" />
              <p className="text-dark-muted">Analyzing article with AI...</p>
            </div>
          ) : result ? (
            <ResultCard result={result} />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-dark-muted">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>Results will appear here after analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Detector;
