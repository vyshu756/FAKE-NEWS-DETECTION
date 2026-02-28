import React from 'react';

function ResultCard({ result }) {
  const isFake = result.prediction === 'Fake News';
  const confidencePercentage = (result.confidence_score * 100).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Prediction Badge */}
      <div className="text-center">
        <div
          className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full text-lg font-bold ${
            isFake
              ? 'bg-red-900/30 text-red-400 border-2 border-red-500'
              : 'bg-green-900/30 text-green-400 border-2 border-green-500'
          }`}
        >
          {isFake ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span>{result.prediction}</span>
        </div>
      </div>

      {/* Scores */}
      <div className="space-y-4">
        {/* Confidence Score */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-dark-muted">Confidence Score</span>
            <span className="text-sm font-bold">{confidencePercentage}%</span>
          </div>
          <div className="w-full bg-dark-bg rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFake ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${confidencePercentage}%` }}
            />
          </div>
        </div>

        {/* Credibility Score */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-dark-muted">Credibility Score</span>
            <span className="text-sm font-bold">{result.credibility_score}/100</span>
          </div>
          <div className="w-full bg-dark-bg rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                result.credibility_score >= 70
                  ? 'bg-green-500'
                  : result.credibility_score >= 40
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${result.credibility_score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Important Keywords */}
      {result.important_keywords && result.important_keywords.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-dark-muted mb-3">Key Influential Words</h4>
          <div className="flex flex-wrap gap-2">
            {result.important_keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-900/30 text-blue-400 border border-blue-500/50 rounded-full text-sm font-medium"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Interpretation */}
      <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
        <h4 className="text-sm font-semibold mb-2 flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Interpretation</span>
        </h4>
        <p className="text-sm text-dark-muted">
          {isFake
            ? 'Our AI model has detected patterns commonly associated with fake news. Please verify this information through multiple trusted sources.'
            : 'The article appears to be legitimate based on our AI analysis. However, always cross-reference important information with multiple sources.'}
        </p>
      </div>
    </div>
  );
}

export default ResultCard;
