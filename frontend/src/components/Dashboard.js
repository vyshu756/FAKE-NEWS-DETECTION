import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/analytics`);
      setAnalytics(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <LoadingSpinner size="large" />
        <p className="text-dark-muted">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 text-red-400 rounded-lg p-6 text-center">
        <p>{error}</p>
        <button
          onClick={fetchAnalytics}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Analytics Dashboard</h2>
        <p className="text-dark-muted">Overview of all predictions made by the system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Predictions */}
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-muted text-sm mb-1">Total Predictions</p>
              <p className="text-3xl font-bold">{analytics?.total_predictions || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Fake News Count */}
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-muted text-sm mb-1">Fake News Detected</p>
              <p className="text-3xl font-bold text-red-400">{analytics?.fake_news_count || 0}</p>
              <p className="text-sm text-dark-muted mt-1">{analytics?.fake_news_percentage || 0}%</p>
            </div>
            <div className="w-12 h-12 bg-red-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Real News Count */}
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-muted text-sm mb-1">Real News Verified</p>
              <p className="text-3xl font-bold text-green-400">{analytics?.real_news_count || 0}</p>
              <p className="text-sm text-dark-muted mt-1">{analytics?.real_news_percentage || 0}%</p>
            </div>
            <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
        <h3 className="text-xl font-semibold mb-6">Prediction Distribution</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Fake News</span>
              <span className="text-sm font-bold text-red-400">{analytics?.fake_news_percentage || 0}%</span>
            </div>
            <div className="w-full bg-dark-bg rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full transition-all duration-500"
                style={{ width: `${analytics?.fake_news_percentage || 0}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Real News</span>
              <span className="text-sm font-bold text-green-400">{analytics?.real_news_percentage || 0}%</span>
            </div>
            <div className="w-full bg-dark-bg rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${analytics?.real_news_percentage || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
