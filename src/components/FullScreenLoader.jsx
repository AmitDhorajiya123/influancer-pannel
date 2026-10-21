import React from 'react';

export default function FullScreenLoader({ label = 'Loading...' }) {
  return (
    <div className="fullscreen-loader-overlay">
      <div className="fullscreen-loader-spinner" />
      <span className="fullscreen-loader-label">{label}</span>
    </div>
  );
}
